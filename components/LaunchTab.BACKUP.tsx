async function handleCreateDraft() {
  if (!address || !title || !imageFile) return;

  setIsUploading(true);

  try {
    const formData = new FormData();
    formData.append("file", imageFile);

    const res = await fetch("/api/upload-ipfs", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Upload request failed");
    }

    const data = await res.json();

    // Accept both supported success shapes
    const ipfsUrl =
      data?.ipfsUrl ||
      (data?.cid ? `ipfs://${data.cid}` : null);

    if (!ipfsUrl) {
      throw new Error("Upload succeeded but no CID returned");
    }

    // Create immutable draft (CID is the source of truth)
    createDraftContent({
      creatorWallet: address,
      title,
      description,
      prompt: title,
      imageUrl: ipfsUrl, // ALWAYS ipfs://CID
    });

    // Reset UI state
    setTitle("");
    setDescription("");
    setImageFile(null);
    setDrafts(getDraftsByCreator(address));
  } catch (err) {
    console.error("Create Draft failed:", err);
    alert("Image upload failed. Check console.");
  } finally {
    setIsUploading(false);
  }
}
