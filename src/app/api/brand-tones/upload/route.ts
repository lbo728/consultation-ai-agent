import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createBrandTone } from '@/lib/brandTone';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string | null;
    const isDefault = formData.get('isDefault') === 'true';

    if (!file) {
      return NextResponse.json({ error: '파일을 선택해주세요.' }, { status: 400 });
    }

    if (!name) {
      return NextResponse.json({ error: '브랜드 톤 이름을 입력해주세요.' }, { status: 400 });
    }

    // 파일 내용 읽기
    const content = await file.text();

    if (!content.trim()) {
      return NextResponse.json({ error: '파일 내용이 비어있습니다.' }, { status: 400 });
    }

    // 브랜드 톤 생성
    const brandTone = await createBrandTone(
      user.id,
      name,
      content,
      description || undefined,
      isDefault
    );

    return NextResponse.json({
      message: '브랜드 톤이 성공적으로 업로드되었습니다.',
      brandTone: {
        id: brandTone.id,
        name: brandTone.name,
        description: brandTone.description,
        isDefault: brandTone.isDefault,
        createdAt: brandTone.createdAt,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '브랜드 톤 업로드에 실패했습니다.' },
      { status: 500 }
    );
  }
}
