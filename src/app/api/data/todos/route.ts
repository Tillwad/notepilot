import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function DELETE(
    req: NextRequest,
) {
    const { todoId } = await req.json();
    if (!todoId) {
        return NextResponse.json({ error: 'Todo ID is required' }, { status: 400 });
    }

    const res = await prisma.todo.delete({
        where: { id: todoId }
    });

    if (!res) {
        return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Todo deleted' }, { status: 200 });
}

export async function POST(
    req: NextRequest,
) {
    const { todoId, checked, text } = await req.json();
    if (!todoId) {
        return NextResponse.json({ error: 'Todo ID is required' }, { status: 400 });
    }

    // Dynamisch das Update-Objekt bauen
    const data: { checked?: boolean; text?: string } = {};
    if (typeof checked === 'boolean') data.checked = checked;
    if (typeof text === 'string') data.text = text;

    if (Object.keys(data).length === 0) {
        return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    const res = await prisma.todo.update({
        where: { id: todoId },
        data
    });

    if (!res) {
        return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Todo updated', todo: res }, { status: 200 });
}