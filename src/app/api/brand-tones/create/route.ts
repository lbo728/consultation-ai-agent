import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createBrandTone } from '@/lib/brandTone';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, content, isDefault } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: '브랜드 톤 이름을 입력해주세요.' }, { status: 400 });
    }

    if (!content || !content.trim()) {
      return NextResponse.json({ error: '내용을 입력해주세요.' }, { status: 400 });
    }

    // 브랜드 톤 생성
    const brandTone = await createBrandTone(
      user.id,
      name,
      content,
      description || undefined,
      isDefault || false
    );

    return NextResponse.json({
      message: '브랜드 톤이 성공적으로 추가되었습니다.',
      brandTone: {
        id: brandTone.id,
        name: brandTone.name,
        description: brandTone.description,
        isDefault: brandTone.isDefault,
        createdAt: brandTone.createdAt,
      },
    });
  } catch (error) {
    console.error('Create error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '브랜드 톤 추가에 실패했습니다.' },
      { status: 500 }
    );
  }
}
