import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ success: false, error: "No prompt provided" });
    }

    // Using Google Imagen-4 via Replicate
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
        "Prefer": "wait",
      },
      body: JSON.stringify({
        version: "9739f83fa142c0f6ca62bfde3e18d2388945f27dd8b1ce60a3a1525e98c89d53",
        input: {
          prompt: prompt,
          aspect_ratio: "1:1",
          output_format: "png",
        },
      }),
    });

    const prediction = await response.json();

    if (prediction.error) {
      throw new Error(prediction.error);
    }

    // Get the result
    let imageUrl = null;
    let attempts = 0;
    
    if (prediction.status === "succeeded") {
      imageUrl = prediction.output[0];
    } else {
      // Poll for completion
      while (!imageUrl && attempts < 60) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const statusResponse = await fetch(
          `https://api.replicate.com/v1/predictions/${prediction.id}`,
          {
            headers: {
              "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
            },
          }
        );
        
        const status = await statusResponse.json();
        
        if (status.status === "succeeded") {
          imageUrl = status.output[0];
          break;
        } else if (status.status === "failed") {
          throw new Error("Image generation failed");
        }
        
        attempts++;
      }
    }

    if (!imageUrl) {
      throw new Error("Image generation timeout");
    }

    // Fetch the image and convert to base64
    const imageResponse = await fetch(imageUrl);
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = `data:image/png;base64,${buffer.toString('base64')}`;

    return NextResponse.json({
      success: true,
      imageBase64: base64,
    });

  } catch (error: any) {
    console.error("AI Generation error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Generation failed"
    }, { status: 500 });
  }
}