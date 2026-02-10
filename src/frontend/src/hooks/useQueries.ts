import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product, Package, HowToOrderStep, UserProfile, SectionContentView, ContentBlockView, BlockType, InstagramFeedConfig } from '../backend';
import { ExternalBlob } from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getCallerUserProfile();
      } catch (error: any) {
        console.error('Error fetching user profile:', error);
        throw error;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.saveCallerUserProfile(profile);
      } catch (error: any) {
        console.error('Error saving profile:', error);
        throw new Error(error?.message || 'Failed to save profile');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Admin Check Query
export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isAdmin();
      } catch (error: any) {
        console.error('Error checking admin status:', error);
        return false;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
    staleTime: 30000, // Cache for 30 seconds
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

// Products Queries
export function useGetAllProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllProducts();
      } catch (error: any) {
        console.error('Error fetching products:', error);
        throw error;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: { title: { english: string; spanish: string }; description: { english: string; spanish: string }; image: ExternalBlob; price: { english: string; spanish: string } }) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.addProduct(product.title, product.description, product.image, product.price);
      } catch (error: any) {
        console.error('Error adding product:', error);
        throw new Error(error?.message || 'Failed to add product');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useEditProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: { id: string; title: { english: string; spanish: string }; description: { english: string; spanish: string }; image: ExternalBlob; price: { english: string; spanish: string } }) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.editProduct(product.id, product.title, product.description, product.image, product.price);
      } catch (error: any) {
        console.error('Error editing product:', error);
        throw new Error(error?.message || 'Failed to edit product');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.deleteProduct(id);
      } catch (error: any) {
        console.error('Error deleting product:', error);
        throw new Error(error?.message || 'Failed to delete product');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// Packages Queries
export function useGetAllPackages() {
  const { actor, isFetching } = useActor();

  return useQuery<Package[]>({
    queryKey: ['packages'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllPackages();
      } catch (error: any) {
        console.error('Error fetching packages:', error);
        throw error;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddPackage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pkg: { name: { english: string; spanish: string }; description: { english: string; spanish: string }; image: ExternalBlob; price: { english: string; spanish: string } }) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.addPackage(pkg.name, pkg.description, pkg.image, pkg.price);
      } catch (error: any) {
        console.error('Error adding package:', error);
        throw new Error(error?.message || 'Failed to add package');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
    },
  });
}

export function useEditPackage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pkg: { id: string; name: { english: string; spanish: string }; description: { english: string; spanish: string }; image: ExternalBlob; price: { english: string; spanish: string } }) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.editPackage(pkg.id, pkg.name, pkg.description, pkg.image, pkg.price);
      } catch (error: any) {
        console.error('Error editing package:', error);
        throw new Error(error?.message || 'Failed to edit package');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
    },
  });
}

export function useDeletePackage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.deletePackage(id);
      } catch (error: any) {
        console.error('Error deleting package:', error);
        throw new Error(error?.message || 'Failed to delete package');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
    },
  });
}

// How To Order Queries
export function useGetAllHowToOrderSteps() {
  const { actor, isFetching } = useActor();

  return useQuery<HowToOrderStep[]>({
    queryKey: ['howToOrderSteps'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllHowToOrderSteps();
      } catch (error: any) {
        console.error('Error fetching how-to-order steps:', error);
        throw error;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddHowToOrderStep() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (step: { stepNumber: bigint; title: { english: string; spanish: string }; description: { english: string; spanish: string }; image: ExternalBlob | null }) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.addHowToOrderStep(step.stepNumber, step.title, step.description, step.image);
      } catch (error: any) {
        console.error('Error adding how-to-order step:', error);
        throw new Error(error?.message || 'Failed to add step');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['howToOrderSteps'] });
    },
  });
}

export function useEditHowToOrderStep() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (step: { stepNumber: bigint; title: { english: string; spanish: string }; description: { english: string; spanish: string }; image: ExternalBlob | null }) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.editHowToOrderStep(step.stepNumber, step.title, step.description, step.image);
      } catch (error: any) {
        console.error('Error editing how-to-order step:', error);
        throw new Error(error?.message || 'Failed to edit step');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['howToOrderSteps'] });
    },
  });
}

// Sections Queries
export function useGetAllAdditionalSections() {
  const { actor, isFetching } = useActor();

  return useQuery<SectionContentView[]>({
    queryKey: ['additionalSections'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllAdditionalSections();
      } catch (error: any) {
        console.error('Error fetching sections:', error);
        throw error;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllSectionsAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<SectionContentView[]>({
    queryKey: ['sectionsAdmin'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllSectionsAdmin();
      } catch (error: any) {
        console.error('Error fetching admin sections:', error);
        throw error;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateAdditionalSection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (section: { title: { english: string; spanish: string }; description: { english: string; spanish: string }; image: ExternalBlob | null; background: ExternalBlob | null; order: bigint; isVisible: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.createAdditionalSection(section.title, section.description, section.image, section.background, section.order, section.isVisible);
      } catch (error: any) {
        console.error('Error creating section:', error);
        throw new Error(error?.message || 'Failed to create section');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['additionalSections'] });
      queryClient.invalidateQueries({ queryKey: ['sectionsAdmin'] });
    },
  });
}

export function useUpdateAdditionalSection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (section: { id: string; title: { english: string; spanish: string }; description: { english: string; spanish: string }; image: ExternalBlob | null; background: ExternalBlob | null; order: bigint; isVisible: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.updateAdditionalSection(section.id, section.title, section.description, section.image, section.background, section.order, section.isVisible);
      } catch (error: any) {
        console.error('Error updating section:', error);
        throw new Error(error?.message || 'Failed to update section');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['additionalSections'] });
      queryClient.invalidateQueries({ queryKey: ['sectionsAdmin'] });
    },
  });
}

export function useDeleteAdditionalSection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.deleteAdditionalSection(id);
      } catch (error: any) {
        console.error('Error deleting section:', error);
        throw new Error(error?.message || 'Failed to delete section');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['additionalSections'] });
      queryClient.invalidateQueries({ queryKey: ['sectionsAdmin'] });
    },
  });
}

// Content Blocks Queries
export function useGetAllContentBlocksAdmin() {
  const { actor, isFetching } = useActor();

  return useMutation({
    mutationFn: async (sectionId: string) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getAllContentBlocksAdmin(sectionId);
      } catch (error: any) {
        console.error('Error fetching content blocks:', error);
        throw new Error(error?.message || 'Failed to fetch content blocks');
      }
    },
  });
}

export function useAddContentBlock() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (block: { sectionId: string; title: { english: string; spanish: string }; content: { english: string; spanish: string }; image: ExternalBlob | null; blockType: BlockType; order: bigint; isVisible: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.addContentBlock(block.sectionId, block.title, block.content, block.image, block.blockType, block.order, block.isVisible);
      } catch (error: any) {
        console.error('Error adding content block:', error);
        throw new Error(error?.message || 'Failed to add content block');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['additionalSections'] });
      queryClient.invalidateQueries({ queryKey: ['sectionsAdmin'] });
    },
  });
}

// Instagram Feed Queries
export function useGetInstagramFeedConfig() {
  const { actor, isFetching } = useActor();

  return useQuery<InstagramFeedConfig | null>({
    queryKey: ['instagramFeedConfig'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getInstagramFeedConfig();
      } catch (error: any) {
        console.error('Error fetching Instagram feed config:', error);
        throw error;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateInstagramFeedConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: { instagramHandle: string; instagramEmbedCode: string; title: { english: string; spanish: string }; description: { english: string; spanish: string }; displayOrder: bigint; isVisible: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.updateInstagramFeedConfig(config.instagramHandle, config.instagramEmbedCode, config.title, config.description, config.displayOrder, config.isVisible);
      } catch (error: any) {
        console.error('Error updating Instagram feed config:', error);
        throw new Error(error?.message || 'Failed to update Instagram feed config');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instagramFeedConfig'] });
    },
  });
}
