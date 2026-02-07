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

// Admin Check
export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Products Queries
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: { english: string; spanish: string };
      description: { english: string; spanish: string };
      image: ExternalBlob;
      price: { english: string; spanish: string };
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addProduct(data.title, data.description, data.image, data.price);
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
    mutationFn: async (data: {
      id: string;
      title: { english: string; spanish: string };
      description: { english: string; spanish: string };
      image: ExternalBlob;
      price: { english: string; spanish: string };
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.editProduct(data.id, data.title, data.description, data.image, data.price);
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
      return actor.deleteProduct(id);
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
      return actor.getAllPackages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddPackage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: { english: string; spanish: string };
      description: { english: string; spanish: string };
      image: ExternalBlob;
      price: { english: string; spanish: string };
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addPackage(data.name, data.description, data.image, data.price);
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
    mutationFn: async (data: {
      id: string;
      name: { english: string; spanish: string };
      description: { english: string; spanish: string };
      image: ExternalBlob;
      price: { english: string; spanish: string };
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.editPackage(data.id, data.name, data.description, data.image, data.price);
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
      return actor.deletePackage(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
    },
  });
}

// How to Order Steps Queries
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      stepNumber: bigint;
      title: { english: string; spanish: string };
      description: { english: string; spanish: string };
      image: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addHowToOrderStep(data.stepNumber, data.title, data.description, data.image);
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
    mutationFn: async (data: {
      stepNumber: bigint;
      title: { english: string; spanish: string };
      description: { english: string; spanish: string };
      image: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.editHowToOrderStep(data.stepNumber, data.title, data.description, data.image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['howToOrderSteps'] });
    },
  });
}

// Dynamic Sections Queries
export function useGetAllAdditionalSections() {
  const { actor, isFetching } = useActor();

  return useQuery<SectionContentView[]>({
    queryKey: ['additionalSections'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAdditionalSections();
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
      return actor.getAllSectionsAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateAdditionalSection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: { english: string; spanish: string };
      description: { english: string; spanish: string };
      image: ExternalBlob | null;
      background: ExternalBlob | null;
      order: bigint;
      isVisible: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createAdditionalSection(
        data.title,
        data.description,
        data.image,
        data.background,
        data.order,
        data.isVisible
      );
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
    mutationFn: async (data: {
      id: string;
      title: { english: string; spanish: string };
      description: { english: string; spanish: string };
      image: ExternalBlob | null;
      background: ExternalBlob | null;
      order: bigint;
      isVisible: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateAdditionalSection(
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
      return actor.deleteAdditionalSection(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['additionalSections'] });
      queryClient.invalidateQueries({ queryKey: ['sectionsAdmin'] });
    },
  });
}

// Content Blocks Queries
export function useGetAllContentBlocksAdmin() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (sectionId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllContentBlocksAdmin(sectionId);
    },
  });
}

export function useAddContentBlock() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      sectionId: string;
      title: { english: string; spanish: string };
      content: { english: string; spanish: string };
      image: ExternalBlob | null;
      blockType: BlockType;
      order: bigint;
      isVisible: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addContentBlock(
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
      return actor.getInstagramFeedConfig();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateInstagramFeedConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      instagramHandle: string;
      instagramEmbedCode: string;
      title: { english: string; spanish: string };
      description: { english: string; spanish: string };
      displayOrder: bigint;
      isVisible: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateInstagramFeedConfig(
        data.instagramHandle,
        data.instagramEmbedCode,
        data.title,
        data.description,
        data.displayOrder,
        data.isVisible
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instagramFeedConfig'] });
    },
  });
}
