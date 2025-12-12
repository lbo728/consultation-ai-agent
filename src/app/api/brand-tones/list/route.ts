import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getBrandTonesByUserId } from '@/lib/brandTone';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const brandTones = await getBrandTonesByUserId(user.id);

    return NextResponse.json({
      brandTones: brandTones.map((tone) => ({
        id: tone.id,
        name: tone.name,
        description: tone.description,
        isDefault: tone.isDefault,
        createdAt: tone.createdAt,
      })),
    });
  } catch (error) {
    console.error('List error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '브랜드 톤 목록 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}
