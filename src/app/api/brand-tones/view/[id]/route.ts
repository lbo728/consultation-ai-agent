import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getBrandToneById } from '@/lib/brandTone';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const { id } = await params;
    const tone = await getBrandToneById(id);

    if (!tone) {
      return NextResponse.json({ error: '브랜드 톤을 찾을 수 없습니다.' }, { status: 404 });
    }

    // 본인의 톤인지 확인
    if (tone.userId !== user.id) {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
    }

    return NextResponse.json({
      tone: {
        id: tone.id,
        name: tone.name,
        description: tone.description,
        content: tone.instructionContent,
        isDefault: tone.isDefault,
        createdAt: tone.createdAt,
      },
    });
  } catch (error) {
    console.error('View tone error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '브랜드 톤 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
