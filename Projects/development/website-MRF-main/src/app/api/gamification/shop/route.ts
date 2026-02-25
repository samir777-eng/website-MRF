import { NextRequest, NextResponse } from 'next/server';
import { SHOP_ITEMS, getShopItemsByCategory, ShopItemCategory } from '@/types/gamification';

/**
 * GET /api/gamification/shop
 * Get shop items, optionally filtered by category
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as ShopItemCategory | null;

    let items;
    if (category && ['power-ups', 'cosmetics', 'content', 'bundles'].includes(category)) {
      items = getShopItemsByCategory(category);
    } else {
      items = SHOP_ITEMS.filter(item => item.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder);
    }

    // Group by category for easier frontend rendering
    const grouped = {
      'power-ups': items.filter(i => i.category === 'power-ups'),
      'cosmetics': items.filter(i => i.category === 'cosmetics'),
      'content': items.filter(i => i.category === 'content'),
      'bundles': items.filter(i => i.category === 'bundles'),
    };

    return NextResponse.json({
      success: true,
      items: category ? items : undefined,
      grouped: category ? undefined : grouped,
      totalItems: items.length,
    });
  } catch (error) {
    console.error('Get shop items error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ. يرجى المحاولة مرة أخرى.' },
      { status: 500 }
    );
  }
}

