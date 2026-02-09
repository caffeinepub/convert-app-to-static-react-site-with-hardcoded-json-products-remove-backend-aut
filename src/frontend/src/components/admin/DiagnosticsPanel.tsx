import { useState } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsCallerAdmin, useGetAllProducts, useAddProduct, useEditProduct, useDeleteProduct } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Loader2, Play, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../../backend';

interface DiagnosticResult {
  step: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message: string;
  details?: string;
}

export default function DiagnosticsPanel() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, refetch: refetchAdmin } = useIsCallerAdmin();
  const { data: products, refetch: refetchProducts } = useGetAllProducts();
  const addProduct = useAddProduct();
  const editProduct = useEditProduct();
  const deleteProduct = useDeleteProduct();

  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<DiagnosticResult[]>([]);

  const updateResult = (step: string, status: DiagnosticResult['status'], message: string, details?: string) => {
    setResults((prev) => {
      const existing = prev.find((r) => r.step === step);
      if (existing) {
        return prev.map((r) => (r.step === step ? { step, status, message, details } : r));
      }
      return [...prev, { step, status, message, details }];
    });
  };

  const runDiagnostics = async () => {
    setIsRunning(true);
    setResults([]);

    try {
      // Step 1: Check Authentication
      updateResult('auth', 'running', 'Checking authentication state...', '');
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (!identity) {
        updateResult('auth', 'error', 'Not authenticated', 'No Internet Identity session found');
        setIsRunning(false);
        return;
      }

      const principalId = identity.getPrincipal().toString();
      updateResult('auth', 'success', 'Authenticated', `Principal: ${principalId.substring(0, 20)}...`);

      // Step 2: Check Admin Status
      updateResult('admin', 'running', 'Checking admin privileges...', '');
      await new Promise((resolve) => setTimeout(resolve, 500));

      const adminResult = await refetchAdmin();
      if (adminResult.data === true) {
        updateResult('admin', 'success', 'Admin privileges confirmed', 'User has admin role');
      } else {
        updateResult('admin', 'error', 'No admin privileges', 'User does not have admin role');
        setIsRunning(false);
        return;
      }

      // Step 3: Fetch Products
      updateResult('fetch', 'running', 'Fetching products list...', '');
      await new Promise((resolve) => setTimeout(resolve, 500));

      const productsResult = await refetchProducts();
      if (productsResult.data) {
        updateResult(
          'fetch',
          'success',
          'Products fetched successfully',
          `Found ${productsResult.data.length} products`
        );
      } else {
        updateResult('fetch', 'error', 'Failed to fetch products', 'No data returned');
        setIsRunning(false);
        return;
      }

      // Step 4: CRUD Validation - Create
      updateResult('create', 'running', 'Creating test product...', '');
      await new Promise((resolve) => setTimeout(resolve, 500));

      let testProductId: string | null = null;
      try {
        // Create a minimal test image (1x1 transparent PNG)
        const testImageBytes = new Uint8Array([
          137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0, 31,
          21, 196, 137, 0, 0, 0, 13, 73, 68, 65, 84, 120, 156, 99, 0, 1, 0, 0, 5, 0, 1, 13, 10, 45, 180, 0, 0, 0, 0,
          73, 69, 78, 68, 174, 66, 96, 130,
        ]);
        const testImage = ExternalBlob.fromBytes(testImageBytes);

        const newProduct = await addProduct.mutateAsync({
          title: { english: '[TEST] Diagnostic Product', spanish: '[PRUEBA] Producto de Diagnóstico' },
          description: {
            english: 'This is a test product created by diagnostics',
            spanish: 'Este es un producto de prueba creado por diagnósticos',
          },
          image: testImage,
          price: { english: '$0.00', spanish: '$0.00' },
        });

        testProductId = newProduct.id;
        updateResult('create', 'success', 'Test product created', `Product ID: ${testProductId}`);
      } catch (error: any) {
        updateResult('create', 'error', 'Failed to create test product', error?.message || 'Unknown error');
        setIsRunning(false);
        return;
      }

      // Step 5: CRUD Validation - Read (verify creation)
      updateResult('read', 'running', 'Verifying test product exists...', '');
      await new Promise((resolve) => setTimeout(resolve, 500));

      const verifyResult = await refetchProducts();
      const createdProduct = verifyResult.data?.find((p) => p.id === testProductId);
      if (createdProduct) {
        updateResult('read', 'success', 'Test product verified', 'Product found in list');
      } else {
        updateResult('read', 'error', 'Test product not found', 'Product was not in the fetched list');
      }

      // Step 6: CRUD Validation - Update
      if (testProductId && createdProduct) {
        updateResult('update', 'running', 'Updating test product...', '');
        await new Promise((resolve) => setTimeout(resolve, 500));

        try {
          await editProduct.mutateAsync({
            id: testProductId,
            title: { english: '[TEST] Updated Product', spanish: '[PRUEBA] Producto Actualizado' },
            description: {
              english: 'This product has been updated',
              spanish: 'Este producto ha sido actualizado',
            },
            image: createdProduct.image,
            price: { english: '$1.00', spanish: '$1.00' },
          });

          const updateVerify = await refetchProducts();
          const updatedProduct = updateVerify.data?.find((p) => p.id === testProductId);
          if (updatedProduct && updatedProduct.title.english === '[TEST] Updated Product') {
            updateResult('update', 'success', 'Test product updated', 'Update verified successfully');
          } else {
            updateResult('update', 'error', 'Update verification failed', 'Product was not updated correctly');
          }
        } catch (error: any) {
          updateResult('update', 'error', 'Failed to update test product', error?.message || 'Unknown error');
        }
      }

      // Step 7: CRUD Validation - Delete
      if (testProductId) {
        updateResult('delete', 'running', 'Deleting test product...', '');
        await new Promise((resolve) => setTimeout(resolve, 500));

        try {
          await deleteProduct.mutateAsync(testProductId);

          const deleteVerify = await refetchProducts();
          const deletedProduct = deleteVerify.data?.find((p) => p.id === testProductId);
          if (!deletedProduct) {
            updateResult('delete', 'success', 'Test product deleted', 'Product removed successfully');
          } else {
            updateResult('delete', 'error', 'Delete verification failed', 'Product still exists after deletion');
          }
        } catch (error: any) {
          updateResult('delete', 'error', 'Failed to delete test product', error?.message || 'Unknown error');
        }
      }

      toast.success('Diagnostics completed!');
    } catch (error: any) {
      console.error('Diagnostics error:', error);
      toast.error('Diagnostics failed: ' + (error?.message || 'Unknown error'));
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'running':
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const allSuccess = results.length > 0 && results.every((r) => r.status === 'success');
  const hasErrors = results.some((r) => r.status === 'error');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>System Diagnostics</CardTitle>
            <CardDescription>
              Run comprehensive tests on authentication, authorization, and product CRUD operations
            </CardDescription>
          </div>
          <Button
            onClick={runDiagnostics}
            disabled={isRunning}
            className="bg-gradient-to-r from-rose-400 to-pink-600 hover:from-rose-500 hover:to-pink-700"
          >
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Run Diagnostics
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {results.length === 0 && !isRunning && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Ready to run diagnostics</AlertTitle>
            <AlertDescription>
              Click "Run Diagnostics" to test authentication, admin privileges, and product CRUD operations. This will
              create and delete a temporary test product.
            </AlertDescription>
          </Alert>
        )}

        {allSuccess && !isRunning && (
          <Alert className="border-green-600 bg-green-50 dark:bg-green-950/20">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-600">All tests passed!</AlertTitle>
            <AlertDescription className="text-green-600">
              Your system is functioning correctly. Authentication, authorization, and CRUD operations are working as
              expected.
            </AlertDescription>
          </Alert>
        )}

        {hasErrors && !isRunning && (
          <Alert className="border-red-600 bg-red-50 dark:bg-red-950/20">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-600">Some tests failed</AlertTitle>
            <AlertDescription className="text-red-600">
              Please review the errors below and contact support if issues persist.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          {results.map((result) => (
            <Card key={result.step} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getStatusIcon(result.status)}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold capitalize">{result.step}</h4>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          result.status === 'success'
                            ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400'
                            : result.status === 'error'
                              ? 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400'
                              : result.status === 'running'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-950/30 dark:text-gray-400'
                        }`}
                      >
                        {result.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{result.message}</p>
                    {result.details && (
                      <p className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded mt-2">
                        {result.details}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
