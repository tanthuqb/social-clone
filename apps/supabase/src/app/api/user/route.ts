import { type NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server';
import { updateUserAction } from '@/lib/actions/user/actions';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { updateProfilewSchema } from '@/lib/db/schema/profile';


export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const supabase = createClient();
    const {data,error} = await supabase.from('profiles').select('*').eq('id',userId).maybeSingle();
    if (error || !data) return NextResponse.json(error);
    return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
    try {       
        const requestData = await request.json()
        const validatedData = updateProfilewSchema.parse(await requestData);
        const data = await updateUserAction(validatedData)
        return NextResponse.json(data, { status: 200 });
    } catch (err) {
        if (err instanceof z.ZodError) {
            return NextResponse.json({ error: err.issues }, { status: 400 });
        } else {
            return NextResponse.json({ error: err }, { status: 500 });
        }
    }
}


