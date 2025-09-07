import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request){
  
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "USER") {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = Number(session.user.id);

  const stream = new ReadableStream({
    async start(controller) {
        const encoder = new TextEncoder();

        //Poll every 5s  for new notifications (simplest stretegy)
        const interval = setInterval( async () => {
            const unread = await prisma.notification.findMany({
                where: {userId, read: false},
                orderBy: {createdAt: "desc"},
                take : 5
            });

            if(unread.length > 0){
                controller.enqueue(
                    encoder.encode(`data:  ${JSON.stringify(unread)}\n\n`)
                );
            }
        }, 5000);

        controller.enqueue(encoder.encode("data: connected\n\n"));


        //cleanup when client disconnects
        req.signal.addEventListener("abort", () => {
            clearInterval(interval);
            controller.close();
        });
    },
  });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    });


}