import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { deleteBrandTone } from '@/lib/brandTone';

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const body = await request.json();
    const { toneId } = body;

    if (!toneId) {
      return NextResponse.json({ error: '브랜드 톤 ID가 필요합니다.' }, { status: 400 });
    }

    const success = await deleteBrandTone(toneId, user.id);

    if (!success) {
      return NextResponse.json({ error: '브랜드 톤 삭제에 실패했습니다.' }, { status: 500 });
    }

    return NextResponse.json({ message: '브랜드 톤이 삭제되었습니다.' });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '브랜드 톤 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
