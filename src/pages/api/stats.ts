import type { APIRoute } from 'astro';
import { db, Stats, eq } from 'astro:db';

export const GET: APIRoute = async () => {
    try {
        let stats = await db.select().from(Stats).where(eq(Stats.id, 'global_stats'));
        
        if (stats.length === 0) {
            await db.insert(Stats).values({ id: 'global_stats', visitors: 0, uploads: 0, success_crops: 0 });
            stats = await db.select().from(Stats).where(eq(Stats.id, 'global_stats'));
        }

        return new Response(JSON.stringify(stats[0]), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: 'Database error' }), { status: 500 });
    }
};

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const action = body.action; // 'visitor', 'upload', 'crop'

        let stats = await db.select().from(Stats).where(eq(Stats.id, 'global_stats'));
        if (stats.length === 0) {
            await db.insert(Stats).values({ id: 'global_stats', visitors: 0, uploads: 0, success_crops: 0 });
            stats = await db.select().from(Stats).where(eq(Stats.id, 'global_stats'));
        }

        const current = stats[0];
        
        if (action === 'visitor') {
            await db.update(Stats).set({ visitors: current.visitors + 1 }).where(eq(Stats.id, 'global_stats'));
        } else if (action === 'upload') {
            await db.update(Stats).set({ uploads: current.uploads + 1 }).where(eq(Stats.id, 'global_stats'));
        } else if (action === 'crop') {
            await db.update(Stats).set({ success_crops: current.success_crops + 1 }).where(eq(Stats.id, 'global_stats'));
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (e) {
        return new Response(JSON.stringify({ error: 'Failed to update stats' }), { status: 500 });
    }
};
