import { getServiceSupabase } from '@/lib/supabase';

export interface BrandTone {
  id: string;
  userId: string;
  name: string;
  description?: string;
  instructionContent: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function createBrandTone(
  userId: string,
  name: string,
  instructionContent: string,
  description?: string,
  isDefault?: boolean
): Promise<BrandTone> {
  const supabase = getServiceSupabase();

  const { data, error } = await supabase
    .from('brand_tones')
    .insert({
      user_id: userId,
      name,
      description,
      instruction_content: instructionContent,
      is_default: isDefault || false,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`브랜드 톤 생성 실패: ${error.message}`);
  }

  return mapBrandTone(data);
}

export async function getBrandTonesByUserId(userId: string): Promise<BrandTone[]> {
  const supabase = getServiceSupabase();

  const { data, error } = await supabase
    .from('brand_tones')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`브랜드 톤 조회 실패: ${error.message}`);
  }

  return data.map(mapBrandTone);
}

export async function getBrandToneById(id: string): Promise<BrandTone | undefined> {
  const supabase = getServiceSupabase();

  const { data, error } = await supabase
    .from('brand_tones')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return undefined;
  }

  return mapBrandTone(data);
}

export async function getDefaultBrandTone(userId: string): Promise<BrandTone | undefined> {
  const supabase = getServiceSupabase();

  const { data, error } = await supabase
    .from('brand_tones')
    .select('*')
    .eq('user_id', userId)
    .eq('is_default', true)
    .single();

  if (error || !data) {
    return undefined;
  }

  return mapBrandTone(data);
}

export async function updateBrandTone(
  id: string,
  updates: {
    name?: string;
    description?: string;
    instructionContent?: string;
    isDefault?: boolean;
  }
): Promise<BrandTone> {
  const supabase = getServiceSupabase();

  const updateData: Record<string, unknown> = {};
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.instructionContent !== undefined)
    updateData.instruction_content = updates.instructionContent;
  if (updates.isDefault !== undefined) updateData.is_default = updates.isDefault;

  const { data, error } = await supabase
    .from('brand_tones')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`브랜드 톤 업데이트 실패: ${error.message}`);
  }

  return mapBrandTone(data);
}

export async function deleteBrandTone(id: string, userId: string): Promise<boolean> {
  const supabase = getServiceSupabase();

  const { error } = await supabase
    .from('brand_tones')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  return !error;
}

function mapBrandTone(data: any): BrandTone {
  return {
    id: data.id,
    userId: data.user_id,
    name: data.name,
    description: data.description || undefined,
    instructionContent: data.instruction_content,
    isDefault: data.is_default,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}
