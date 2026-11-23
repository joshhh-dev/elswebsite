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
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useDashboard } from "@/lib/DashboardContext";
import { logIfUnexpected } from "@/lib/logIfUnexpected";
import { compressImageToDataUrl, MAX_DATA_URL_BYTES } from "@/lib/imageCompress";
import { PRODUCT_CATEGORIES } from "@/lib/productCategories";

const EMPTY_PRODUCT = {
  name: "",
  slug: "",
  tagline: "",
  heroImage: "",
  order: 0,
  template: "stacked",
  featuredOnHome: false,
  category: "",
  blocks: [],
  items: [],
  status: "draft",
};

const TEMPLATE_OPTIONS = [
  { value: "stacked", label: "Stacked (simple)" },
  { value: "split", label: "Two-Column (feature layout)" },
];

const EMPTY_PRODUCT_ITEM = { name: "", image: "", description: "", group: "" };

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

  const updateListItem = (itemIndex, value) => {
    const items = [...(block.items || [])];
    items[itemIndex] = value;
    onChange({ ...block, items });
  };
  const removeListItem = (itemIndex) => {
    onChange({ ...block, items: (block.items || []).filter((_, i) => i !== itemIndex) });
  };
  const addListItem = () => {
    onChange({ ...block, items: [...(block.items || []), ""] });
  };

  // benefits items are {title, description} objects, unlike the plain
  // string items every other list-shaped block uses above.
  const updateBenefitItem = (itemIndex, field, value) => {
    const items = [...(block.items || [])];
    items[itemIndex] = { ...items[itemIndex], [field]: value };
    onChange({ ...block, items });
  };
  const removeBenefitItem = (itemIndex) => {
    onChange({ ...block, items: (block.items || []).filter((_, i) => i !== itemIndex) });
  };
  const addBenefitItem = () => {
    onChange({ ...block, items: [...(block.items || []), { title: "", description: "" }] });
  };

  const typeLabel =
    block.type === "text"
      ? "Text block"
      : block.type === "list"
      ? "Feature list block"
      : block.type === "image"
      ? "Image block"
      : block.type === "keyFeatures"
      ? "Key Features block"
      : block.type === "advantages"
      ? "Advantages block"
      : block.type === "benefits"
      ? "Benefits-to-laundry block"
      : "Related Products block";

  return (
    <div className="block-editor">
      <div className="block-editor-header">
        <span>{typeLabel}</span>
        <button type="button" className="block-remove-btn" onClick={onRemove}>
          Remove
        </button>
      </div>

      {block.type === "text" && (
        <textarea
          rows={4}
          value={block.content}
          onChange={(e) => onChange({ ...block, content: e.target.value })}
          placeholder="Write the text for this section..."
        />
      )}

      {block.type === "list" && (
        <div>
          <input
            type="text"
            value={block.heading || ""}
            onChange={(e) => onChange({ ...block, heading: e.target.value })}
            placeholder="List heading (e.g. Main Features & Functions)"
            style={{ marginBottom: 10 }}
          />
          {(block.items || []).map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input
                type="text"
                value={item}
                onChange={(e) => updateListItem(i, e.target.value)}
                placeholder={`Item ${i + 1}`}
                style={{ flex: 1 }}
              />
              <button type="button" className="block-remove-btn" onClick={() => removeListItem(i)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="status-toggle-btn" onClick={addListItem}>
            + Add Item
          </button>
        </div>
      )}

      {block.type === "image" && (
        <div>
          {block.url ? (
            // eslint-disable-next-line @next/next/no-img-element
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

      {(block.type === "keyFeatures" || block.type === "advantages") && (
        <div>
          <input
            type="text"
            value={block.label || ""}
            onChange={(e) => onChange({ ...block, label: e.target.value })}
            placeholder={block.type === "keyFeatures" ? "Label (e.g. KEY FEATURES)" : "Label (e.g. ADVANTAGES)"}
            style={{ marginBottom: 10 }}
          />
          <input
            type="text"
            value={block.headline || ""}
            onChange={(e) => onChange({ ...block, headline: e.target.value })}
            placeholder="Headline"
            style={{ marginBottom: 10 }}
          />
          {block.type === "keyFeatures" && (
            <select
              value={block.columns === 3 ? 3 : 2}
              onChange={(e) => onChange({ ...block, columns: Number(e.target.value) })}
              style={{ marginBottom: 10 }}
            >
              <option value={2}>2 columns</option>
              <option value={3}>3 columns</option>
            </select>
          )}
          {(block.items || []).map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input
                type="text"
                value={item}
                onChange={(e) => updateListItem(i, e.target.value)}
                placeholder={`Item ${i + 1}`}
                style={{ flex: 1 }}
              />
              <button type="button" className="block-remove-btn" onClick={() => removeListItem(i)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="status-toggle-btn" onClick={addListItem}>
            + Add Item
          </button>
        </div>
      )}

      {block.type === "benefits" && (
        <div>
          <input
            type="text"
            value={block.label || ""}
            onChange={(e) => onChange({ ...block, label: e.target.value })}
            placeholder="Label (e.g. BENEFITS TO LAUNDRY)"
            style={{ marginBottom: 10 }}
          />
          <input
            type="text"
            value={block.headline || ""}
            onChange={(e) => onChange({ ...block, headline: e.target.value })}
            placeholder="Headline"
            style={{ marginBottom: 10 }}
          />
          {(block.items || []).map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                marginBottom: 10,
                paddingBottom: 10,
                borderBottom: "1px solid var(--border)",
              }}
            >
              <input
                type="text"
                value={item.title || ""}
                onChange={(e) => updateBenefitItem(i, "title", e.target.value)}
                placeholder={`Benefit ${i + 1} title (e.g. CONSISTENT STEAM PERFORMANCE)`}
              />
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="text"
                  value={item.description || ""}
                  onChange={(e) => updateBenefitItem(i, "description", e.target.value)}
                  placeholder="Description"
                  style={{ flex: 1 }}
                />
                <button type="button" className="block-remove-btn" onClick={() => removeBenefitItem(i)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button type="button" className="status-toggle-btn" onClick={addBenefitItem}>
            + Add Benefit
          </button>
        </div>
      )}

      {block.type === "relatedProducts" && (
        <p className="subtitle" style={{ margin: 0 }}>
          Automatically shows other published products sharing this product&apos;s Solutions-menu
          category (see the Category field above) — nothing to configure here. If this product has
          no category set, or no other published products share it, this section won&apos;t show
          anything on the live page.
        </p>
      )}
    </div>
  );
}

function ProductItemEditor({ item, onChange, onRemove }) {
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
      onChange({ ...item, image: dataUrl });
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
        <span>Product</span>
        <button type="button" className="block-remove-btn" onClick={onRemove}>
          Remove
        </button>
      </div>

      {item.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.image} alt="" className="block-image-preview" />
      ) : (
        <p className="subtitle" style={{ margin: "0 0 12px" }}>
          No image uploaded yet.
        </p>
      )}
      <input type="file" accept="image/*" onChange={handleFileSelect} disabled={uploading} />
      {uploading && <p className="subtitle">Processing image...</p>}
      {uploadError && <p className="error-text">{uploadError}</p>}

      <input
        type="text"
        value={item.name}
        onChange={(e) => onChange({ ...item, name: e.target.value })}
        placeholder="Product name (e.g. WM-5000 Front Load Washer)"
        style={{ marginTop: 10 }}
      />
      <textarea
        rows={3}
        value={item.description}
        onChange={(e) => onChange({ ...item, description: e.target.value })}
        placeholder="Short description"
        style={{ marginTop: 10 }}
      />
      <input
        type="text"
        value={item.group || ""}
        onChange={(e) => onChange({ ...item, group: e.target.value })}
        placeholder="Tab group (optional, e.g. Retail and Commercial Laundry Products)"
        style={{ marginTop: 10 }}
      />
      <p className="subtitle" style={{ margin: "4px 0 0" }}>
        Give 2+ products the same tab-group text to split &quot;Our Products&quot; into filter tabs on
        the public page. Leave blank to keep it in one flat grid.
      </p>
    </div>
  );
}

function ProductEditor({ product, onSaved, onCancel, onDelete }) {
  const [name, setName] = useState(product.name);
  const [slug, setSlug] = useState(product.slug);
  const [tagline, setTagline] = useState(product.tagline || "");
  const [heroImage, setHeroImage] = useState(product.heroImage || "");
  const [order, setOrder] = useState(product.order ?? 0);
  const [category, setCategory] = useState(product.category || "");
  const [template, setTemplate] = useState(product.template || "stacked");
  const [featuredOnHome, setFeaturedOnHome] = useState(product.featuredOnHome || false);
  const [blocks, setBlocks] = useState(product.blocks);
  const [items, setItems] = useState(product.items || []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [heroUploading, setHeroUploading] = useState(false);

  const updateBlock = (index, newBlock) => {
    setBlocks((prev) => prev.map((b, i) => (i === index ? newBlock : b)));
  };
  const removeBlock = (index) => {
    setBlocks((prev) => prev.filter((_, i) => i !== index));
  };
  const addBlock = (type) => {
    const shape =
      type === "text"
        ? { type: "text", content: "" }
        : type === "list"
        ? { type: "list", heading: "", items: [""] }
        : type === "image"
        ? { type: "image", url: "", caption: "" }
        : type === "keyFeatures"
        ? { type: "keyFeatures", label: "KEY FEATURES", headline: "", items: [""], columns: 2 }
        : type === "advantages"
        ? { type: "advantages", label: "ADVANTAGES", headline: "", items: [""] }
        : type === "benefits"
        ? { type: "benefits", label: "BENEFITS TO LAUNDRY", headline: "", items: [{ title: "", description: "" }] }
        : { type: "relatedProducts" };
    setBlocks((prev) => [...prev, shape]);
  };

  const updateItem = (index, newItem) => {
    setItems((prev) => prev.map((it, i) => (i === index ? newItem : it)));
  };
  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };
  const addItem = () => {
    setItems((prev) => [...prev, { ...EMPTY_PRODUCT_ITEM }]);
  };

  const handleHeroSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroUploading(true);
    setError("");
    try {
      const dataUrl = await compressImageToDataUrl(file);
      if (dataUrl.length > MAX_DATA_URL_BYTES) {
        setError("That hero image is still too large after compression. Try a smaller image.");
        return;
      }
      setHeroImage(dataUrl);
    } catch (err) {
      console.error(err);
      setError("Couldn't process that image. Please try a different file.");
    } finally {
      setHeroUploading(false);
    }
  };

  const save = async (status) => {
    const trimmedName = name.trim();
    const trimmedSlug = slugify(slug || name);
    if (!trimmedName) {
      setError("Please add a product name first.");
      return;
    }
    if (!trimmedSlug) {
      setError("Please add a URL slug first.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const existing = await getDocs(collection(db, "products"));
      const conflict = existing.docs.find(
        (d) => d.id !== product.id && d.data().slug === trimmedSlug
      );
      if (conflict) {
        setError(`Slug "${trimmedSlug}" is already used by another product.`);
        return;
      }

      const data = {
        name: trimmedName,
        slug: trimmedSlug,
        tagline: tagline.trim(),
        heroImage,
        order: Number(order) || 0,
        category,
        template,
        featuredOnHome,
        blocks,
        items,
        status,
        updatedAt: serverTimestamp(),
      };
      if (product.id) {
        await updateDoc(doc(db, "products", product.id), data);
      } else {
        await addDoc(collection(db, "products"), { ...data, createdAt: serverTimestamp() });
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
        <label htmlFor="productName">Name</label>
        <input
          id="productName"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!product.id && !slug) setSlug(slugify(e.target.value));
          }}
          placeholder="e.g. LG, Intelled"
        />
      </div>

      <div className="field">
        <label htmlFor="productSlug">URL slug</label>
        <input
          id="productSlug"
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="e.g. lg"
        />
      </div>

      <div className="field">
        <label htmlFor="productTagline">Hero tagline</label>
        <input
          id="productTagline"
          type="text"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="Short subcopy shown under the product name"
        />
      </div>

      <div className="field">
        <label htmlFor="productOrder">Order</label>
        <input
          id="productOrder"
          type="number"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="productCategory">Solutions menu category</label>
        <select
          id="productCategory"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">— Not shown in Solutions menu —</option>
          {PRODUCT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <p className="subtitle" style={{ margin: "4px 0 0" }}>
          Which group this appears under in the site header&apos;s &quot;Solutions&quot; menu. Leave
          unset to keep it out of that menu for now.
        </p>
      </div>

      <div className="field">
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            checked={featuredOnHome}
            onChange={(e) => setFeaturedOnHome(e.target.checked)}
            style={{ width: "auto" }}
          />
          Feature on homepage
        </label>
        <p className="subtitle" style={{ margin: "4px 0 0" }}>
          Shows this product in the homepage&apos;s &quot;Your turnkey solutions&quot; grid. The lowest Order
          among featured products becomes the big tile.
        </p>
      </div>

      <div className="field">
        <label htmlFor="productTemplate">Page layout</label>
        <select id="productTemplate" value={template} onChange={(e) => setTemplate(e.target.value)}>
          {TEMPLATE_OPTIONS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Hero image</label>
        {heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={heroImage} alt="" className="block-image-preview" />
        ) : (
          <p className="subtitle" style={{ margin: "0 0 12px" }}>
            No hero image uploaded yet.
          </p>
        )}
        <input type="file" accept="image/*" onChange={handleHeroSelect} disabled={heroUploading} />
        {heroUploading && <p className="subtitle">Processing image...</p>}
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
        <button type="button" className="status-toggle-btn" onClick={() => addBlock("list")}>
          + Add Feature List
        </button>
        <button type="button" className="status-toggle-btn" onClick={() => addBlock("image")}>
          + Add Image
        </button>
        <button type="button" className="status-toggle-btn" onClick={() => addBlock("keyFeatures")}>
          + Add Key Features
        </button>
        <button type="button" className="status-toggle-btn" onClick={() => addBlock("advantages")}>
          + Add Advantages
        </button>
        <button type="button" className="status-toggle-btn" onClick={() => addBlock("benefits")}>
          + Add Benefits
        </button>
        <button type="button" className="status-toggle-btn" onClick={() => addBlock("relatedProducts")}>
          + Add Related Products
        </button>
      </div>

      <div className="posts-header">
        <h3 style={{ margin: 0 }}>Our Products</h3>
      </div>
      <p className="subtitle" style={{ margin: "-12px 0 12px" }}>
        Individual products under this department (e.g. specific LG washer/dryer models) — shown as
        their own section on the page.
      </p>

      <div className="post-blocks">
        {items.map((item, i) => (
          <ProductItemEditor
            key={i}
            item={item}
            onChange={(newItem) => updateItem(i, newItem)}
            onRemove={() => removeItem(i)}
          />
        ))}
      </div>

      <div className="post-add-block-row">
        <button type="button" className="status-toggle-btn" onClick={addItem}>
          + Add Product
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
        {product.id && (
          <button type="button" className="danger-btn" onClick={onDelete}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const router = useRouter();
  const { roleChecked, canPublish } = useDashboard();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null); // null = list view

  useEffect(() => {
    if (roleChecked && !canPublish) {
      router.replace("/dashboard");
    }
  }, [roleChecked, canPublish, router]);

  useEffect(() => {
    if (!roleChecked || !canPublish) return;
    const q = query(collection(db, "products"), orderBy("order"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setProducts(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        logIfUnexpected(err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [roleChecked, canPublish]);

  const handleDelete = async (productId) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    await deleteDoc(doc(db, "products", productId));
    setEditingProduct(null);
  };

  if (!roleChecked || !canPublish) {
    return <main className="page-center">Loading...</main>;
  }

  if (editingProduct) {
    return (
      <div className="dashboard">
        <button className="back-link" onClick={() => setEditingProduct(null)}>
          ← Back to Departments
        </button>
        <ProductEditor
          product={editingProduct}
          onSaved={() => setEditingProduct(null)}
          onCancel={() => setEditingProduct(null)}
          onDelete={() => handleDelete(editingProduct.id)}
        />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="posts-header">
        <h2>Departments</h2>
        <button
          className="btn-primary posts-new-btn"
          onClick={() => setEditingProduct({ ...EMPTY_PRODUCT, order: products.length })}
        >
          + New Department
        </button>
      </div>

      {loading ? (
        <p>Loading departments...</p>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <h2>No departments yet</h2>
          <p>Create your first department page — hero image, tagline, and content blocks.</p>
        </div>
      ) : (
        products.map((product) => (
          <div key={product.id} className="post-list-item" onClick={() => setEditingProduct(product)}>
            <div>
              <strong>{product.name}</strong>
            </div>
            <span className={`status-badge ${product.status === "published" ? "status-on" : ""}`}>
              {product.status === "published" ? "Published" : "Draft"}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
