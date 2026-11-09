"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useDashboard } from "@/lib/DashboardContext";
import { compressImageToDataUrl, MAX_DATA_URL_BYTES } from "@/lib/imageCompress";

const EMPTY_POST = { title: "", blocks: [], status: "draft" };

function BlockEditor({ block, index, onChange, onRemove }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const dataUrl = await compressImageToDataUrl(file);
      if (dataUrl.length > MAX_DATA_URL_BYTES) {
        setUploadError(
          "This image is still too large after compression. Try a smaller or simpler image."
        );
        return;
      }
      onChange({ ...block, url: dataUrl });
    } catch (err) {
      console.error(err);
      setUploadError("Couldn't process that image. Please try a different file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="block-editor">
      <div className="block-editor-header">
        <span>{block.type === "text" ? "Text block" : "Image block"}</span>
        <button type="button" className="block-remove-btn" onClick={onRemove}>
          Remove
        </button>
      </div>

      {block.type === "text" ? (
        <textarea
          rows={4}
          value={block.content}
          onChange={(e) => onChange({ ...block, content: e.target.value })}
          placeholder="Write the text for this section..."
        />
      ) : (
        <div>
          {block.url ? (
            <img src={block.url} alt={block.caption || ""} className="block-image-preview" />
          ) : (
            <p className="subtitle" style={{ margin: "0 0 12px" }}>
              No image uploaded yet.
            </p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
          />
          {uploading && <p className="subtitle">Processing image...</p>}
          {uploadError && <p className="error-text">{uploadError}</p>}
          <input
            type="text"
            value={block.caption || ""}
            onChange={(e) => onChange({ ...block, caption: e.target.value })}
            placeholder="Caption (optional)"
            style={{ marginTop: 8 }}
          />
        </div>
      )}
    </div>
  );
}

function PostEditor({ post, onSaved, onCancel, onDelete }) {
  const [title, setTitle] = useState(post.title);
  const [blocks, setBlocks] = useState(post.blocks);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const updateBlock = (index, newBlock) => {
    setBlocks((prev) => prev.map((b, i) => (i === index ? newBlock : b)));
  };
  const removeBlock = (index) => {
    setBlocks((prev) => prev.filter((_, i) => i !== index));
  };
  const addBlock = (type) => {
    setBlocks((prev) => [
      ...prev,
      type === "text" ? { type: "text", content: "" } : { type: "image", url: "", caption: "" },
    ]);
  };

  const save = async (status) => {
    if (!title.trim()) {
      setError("Please add a title first.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const data = {
        title: title.trim(),
        blocks,
        status,
        updatedAt: serverTimestamp(),
      };
      if (post.id) {
        await updateDoc(doc(db, "posts", post.id), data);
      } else {
        await addDoc(collection(db, "posts"), { ...data, createdAt: serverTimestamp() });
      }
      onSaved();
    } catch (err) {
      console.error(err);
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="post-editor">
      <div className="field">
        <label htmlFor="postTitle">Title</label>
        <input
          id="postTitle"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
        />
      </div>

      <div className="post-blocks">
        {blocks.map((block, i) => (
          <BlockEditor
            key={i}
            block={block}
            index={i}
            onChange={(newBlock) => updateBlock(i, newBlock)}
            onRemove={() => removeBlock(i)}
          />
        ))}
      </div>

      <div className="post-add-block-row">
        <button type="button" className="status-toggle-btn" onClick={() => addBlock("text")}>
          + Add Text
        </button>
        <button type="button" className="status-toggle-btn" onClick={() => addBlock("image")}>
          + Add Image
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="post-editor-actions">
        <button className="btn-primary" disabled={saving} onClick={() => save("draft")}>
          Save as Draft
        </button>
        <button className="btn-primary" disabled={saving} onClick={() => save("published")}>
          Publish
        </button>
        <button type="button" className="status-toggle-btn" onClick={onCancel}>
          Cancel
        </button>
        {post.id && (
          <button type="button" className="danger-btn" onClick={onDelete}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default function PostsPage() {
  const router = useRouter();
  const { roleChecked, canPublish } = useDashboard();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null); // null = list view

  useEffect(() => {
    if (roleChecked && !canPublish) {
      router.replace("/dashboard");
    }
  }, [roleChecked, canPublish, router]);

  useEffect(() => {
    if (!roleChecked || !canPublish) return;
    const q = query(collection(db, "posts"), orderBy("updatedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [roleChecked, canPublish]);

  const handleDelete = async (postId) => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    await deleteDoc(doc(db, "posts", postId));
    setEditingPost(null);
  };

  if (!roleChecked || !canPublish) {
    return <main className="page-center">Loading...</main>;
  }

  if (editingPost) {
    return (
      <div className="dashboard">
        <button className="back-link" onClick={() => setEditingPost(null)}>
          ← Back to Posts
        </button>
        <PostEditor
          post={editingPost}
          onSaved={() => setEditingPost(null)}
          onCancel={() => setEditingPost(null)}
          onDelete={() => handleDelete(editingPost.id)}
        />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="posts-header">
        <h2>Posts &amp; Announcements</h2>
        <button className="btn-primary posts-new-btn" onClick={() => setEditingPost({ ...EMPTY_POST })}>
          + New Post
        </button>
      </div>

      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <h2>No posts yet</h2>
          <p>Create your first announcement — it can include text and images.</p>
        </div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="post-list-item" onClick={() => setEditingPost(post)}>
            <div>
              <strong>{post.title}</strong>
              <p className="inquiry-preview">{post.blocks?.length || 0} block(s)</p>
            </div>
            <span className={`status-badge ${post.status === "published" ? "status-on" : ""}`}>
              {post.status === "published" ? "Published" : "Draft"}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
