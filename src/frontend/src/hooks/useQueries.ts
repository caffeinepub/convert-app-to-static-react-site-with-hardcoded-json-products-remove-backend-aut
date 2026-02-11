import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useAdminSession } from './useAdminSession';
import type {
  UserProfile,
  Product,
  Package,
  HowToOrderStep,
  SectionContentView,
  ContentBlockView,
  InstagramFeedConfig,
  TextContent,
  BlockType,
  AdminUser,
} from '../backend';
import { ExternalBlob } from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
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
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Admin Check (kept for backwards compatibility but not used for auth)
export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

// Products
export function useGetAllProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const { sessionId } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: TextContent;
      description: TextContent;
      image: ExternalBlob;
      price: TextContent;
    }) => {
      if (!actor || !sessionId) throw new Error('Not authenticated');
      return actor.addProduct(sessionId, data.title, data.description, data.image, data.price);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useEditProduct() {
  const { actor } = useActor();
  const { sessionId } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      title: TextContent;
      description: TextContent;
      image: ExternalBlob;
      price: TextContent;
    }) => {
      if (!actor || !sessionId) throw new Error('Not authenticated');
      return actor.editProduct(sessionId, data.id, data.title, data.description, data.image, data.price);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const { sessionId } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor || !sessionId) throw new Error('Not authenticated');
      return actor.deleteProduct(sessionId, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// Packages
export function useGetAllPackages() {
  const { actor, isFetching } = useActor();

  return useQuery<Package[]>({
    queryKey: ['packages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPackages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddPackage() {
  const { actor } = useActor();
  const { sessionId } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: TextContent;
      description: TextContent;
      image: ExternalBlob;
      price: TextContent;
    }) => {
      if (!actor || !sessionId) throw new Error('Not authenticated');
      return actor.addPackage(sessionId, data.name, data.description, data.image, data.price);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
    },
  });
}

export function useEditPackage() {
  const { actor } = useActor();
  const { sessionId } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      name: TextContent;
      description: TextContent;
      image: ExternalBlob;
      price: TextContent;
    }) => {
      if (!actor || !sessionId) throw new Error('Not authenticated');
      return actor.editPackage(sessionId, data.id, data.name, data.description, data.image, data.price);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
    },
  });
}

export function useDeletePackage() {
  const { actor } = useActor();
  const { sessionId } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor || !sessionId) throw new Error('Not authenticated');
      return actor.deletePackage(sessionId, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
    },
  });
}

// How to Order Steps
export function useGetAllHowToOrderSteps() {
  const { actor, isFetching } = useActor();

  return useQuery<HowToOrderStep[]>({
    queryKey: ['howToOrderSteps'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllHowToOrderSteps();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddHowToOrderStep() {
  const { actor } = useActor();
  const { sessionId } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      stepNumber: bigint;
      title: TextContent;
      description: TextContent;
      image: ExternalBlob | null;
    }) => {
      if (!actor || !sessionId) throw new Error('Not authenticated');
      return actor.addHowToOrderStep(sessionId, data.stepNumber, data.title, data.description, data.image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['howToOrderSteps'] });
    },
  });
}

export function useEditHowToOrderStep() {
  const { actor } = useActor();
  const { sessionId } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      stepNumber: bigint;
      title: TextContent;
      description: TextContent;
      image: ExternalBlob | null;
    }) => {
      if (!actor || !sessionId) throw new Error('Not authenticated');
      return actor.editHowToOrderStep(sessionId, data.stepNumber, data.title, data.description, data.image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['howToOrderSteps'] });
    },
  });
}

// Sections - Public
export function useGetAllAdditionalSections() {
  const { actor, isFetching } = useActor();

  return useQuery<SectionContentView[]>({
    queryKey: ['sections'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAdditionalSections();
    },
    enabled: !!actor && !isFetching,
  });
}

// Sections - Admin
export function useGetAllSectionsAdmin() {
  const { actor } = useActor();
  const { sessionId } = useAdminSession();

  return useQuery<SectionContentView[]>({
    queryKey: ['sectionsAdmin'],
    queryFn: async () => {
      if (!actor || !sessionId) return [];
      return actor.getAllSectionsAdmin(sessionId);
    },
    enabled: !!actor && !!sessionId,
  });
}

export function useCreateAdditionalSection() {
  const { actor } = useActor();
  const { sessionId } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: TextContent;
      description: TextContent;
      image: ExternalBlob | null;
      background: ExternalBlob | null;
      order: bigint;
      isVisible: boolean;
    }) => {
      if (!actor || !sessionId) throw new Error('Not authenticated');
      return actor.createAdditionalSection(
        sessionId,
        data.title,
        data.description,
        data.image,
        data.background,
        data.order,
        data.isVisible
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
      queryClient.invalidateQueries({ queryKey: ['sectionsAdmin'] });
    },
  });
}

export function useUpdateAdditionalSection() {
  const { actor } = useActor();
  const { sessionId } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      title: TextContent;
      description: TextContent;
      image: ExternalBlob | null;
      background: ExternalBlob | null;
      order: bigint;
      isVisible: boolean;
    }) => {
      if (!actor || !sessionId) throw new Error('Not authenticated');
      return actor.updateAdditionalSection(
        sessionId,
        data.id,
        data.title,
        data.description,
        data.image,
        data.background,
        data.order,
        data.isVisible
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
      queryClient.invalidateQueries({ queryKey: ['sectionsAdmin'] });
    },
  });
}

export function useDeleteAdditionalSection() {
  const { actor } = useActor();
  const { sessionId } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor || !sessionId) throw new Error('Not authenticated');
      return actor.deleteAdditionalSection(sessionId, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
      queryClient.invalidateQueries({ queryKey: ['sectionsAdmin'] });
    },
  });
}

// Content Blocks
export function useGetAllContentBlocksAdmin() {
  const { actor } = useActor();
  const { sessionId } = useAdminSession();

  return useMutation({
    mutationFn: async (sectionId: string) => {
      if (!actor || !sessionId) throw new Error('Not authenticated');
      return actor.getAllContentBlocksAdmin(sessionId, sectionId);
    },
  });
}

export function useAddContentBlock() {
  const { actor } = useActor();
  const { sessionId } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      sectionId: string;
      title: TextContent;
      content: TextContent;
      image: ExternalBlob | null;
      blockType: BlockType;
      order: bigint;
      isVisible: boolean;
    }) => {
      if (!actor || !sessionId) throw new Error('Not authenticated');
      return actor.addContentBlock(
        sessionId,
        data.sectionId,
        data.title,
        data.content,
        data.image,
        data.blockType,
        data.order,
        data.isVisible
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
      queryClient.invalidateQueries({ queryKey: ['sectionsAdmin'] });
    },
  });
}

export function useDeleteContentBlock() {
  const { actor } = useActor();
  const { sessionId } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { sectionId: string; blockId: bigint }) => {
      if (!actor || !sessionId) throw new Error('Not authenticated');
      return actor.adminDeleteContentBlock(sessionId, data.sectionId, data.blockId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
      queryClient.invalidateQueries({ queryKey: ['sectionsAdmin'] });
    },
  });
}

// Instagram Feed
export function useGetInstagramFeedConfig() {
  const { actor, isFetching } = useActor();

  return useQuery<InstagramFeedConfig | null>({
    queryKey: ['instagramFeed'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getInstagramFeedConfig();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateInstagramFeedConfig() {
  const { actor } = useActor();
  const { sessionId } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      instagramHandle: string;
      instagramEmbedCode: string;
      title: TextContent;
      description: TextContent;
      displayOrder: bigint;
      isVisible: boolean;
    }) => {
      if (!actor || !sessionId) throw new Error('Not authenticated');
      return actor.updateInstagramFeedConfig(
        sessionId,
        data.instagramHandle,
        data.instagramEmbedCode,
        data.title,
        data.description,
        data.displayOrder,
        data.isVisible
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instagramFeed'] });
    },
  });
}

// User Management
export function useGetAdminUsers() {
  const { actor } = useActor();
  const { sessionId } = useAdminSession();

  return useQuery<AdminUser[]>({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      if (!actor || !sessionId) return [];
      return actor.getAdminUsers(sessionId);
    },
    enabled: !!actor && !!sessionId,
  });
}

export function useCreateAdminUser() {
  const { actor } = useActor();
  const { sessionId } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { username: string; fullName: string; password: string }) => {
      if (!actor || !sessionId) throw new Error('Not authenticated');
      return actor.createAdminUser(sessionId, data.username, data.fullName, data.password);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });
}
