import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import HeaderSuperAdmin from "../Components/HeaderSuperAdmin";
import SidebarSuperAdmin from "../Components/SidebarSuperAdmin";
import HeaderAdmin from "../Components/HeaderAdmin";
import SidebarAdmin from "../Components/SidebarAdmin";
import HeaderUser from "../Components/HeaderUser";
import SidebarUser from "../Components/SidebarUser";

// ─────────────────────────────────────────────
// ProductImage
// Maps product name keywords to real, reliable
// static photo URLs. Always displays instantly —
// no API calls, no broken images ever.
// ─────────────────────────────────────────────

// A curated map of keywords → guaranteed-working photo URLs
const PRODUCT_IMAGE_MAP = [
    // ── CHAIR & FURNITURE ──
    { keys: ["chair"], url: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&h=400&fit=crop&q=90" },
    { keys: ["sofa", "couch"], url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop&q=90" },
    { keys: ["furniture"], url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop&q=90" },
    { keys: ["table", "desk"], url: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&h=400&fit=crop&q=90" },
    { keys: ["bed", "mattress", "pillow"], url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=400&fit=crop&q=90" },
    // ── LED & LIGHTING ──
    { keys: ["led"], url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&q=90" },
    { keys: ["bulb"], url: "https://images.unsplash.com/photo-1495121553079-4c61bcce1894?w=600&h=400&fit=crop&q=90" },
    { keys: ["lamp"], url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=400&fit=crop&q=90" },
    { keys: ["light", "tube", "strip"], url: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=600&h=400&fit=crop&q=90" },
    // ── ELECTRONICS ──
    { keys: ["laptop", "computer", "notebook", "pc"], url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop&q=90" },
    { keys: ["phone", "mobile", "smartphone", "iphone", "samsung"], url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop&q=90" },
    { keys: ["tablet", "ipad"], url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=400&fit=crop&q=90" },
    { keys: ["monitor", "screen", "display"], url: "https://images.unsplash.com/photo-1527443224154-c4a573d0e0b9?w=600&h=400&fit=crop&q=90" },
    { keys: ["keyboard"], url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=400&fit=crop&q=90" },
    { keys: ["mouse"], url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=400&fit=crop&q=90" },
    { keys: ["headphone", "earphone", "earbud", "airpod"], url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop&q=90" },
    { keys: ["camera", "dslr"], url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=400&fit=crop&q=90" },
    { keys: ["tv", "television"], url: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop&q=90" },
    { keys: ["speaker", "bluetooth"], url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=400&fit=crop&q=90" },
    { keys: ["watch", "smartwatch"], url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop&q=90" },
    { keys: ["charger", "cable", "usb"], url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&h=400&fit=crop&q=90" },
    { keys: ["printer"], url: "https://images.unsplash.com/photo-1612198273689-e4e0d8db11e7?w=600&h=400&fit=crop&q=90" },
    { keys: ["fan", "ac", "cooler", "air conditioner"], url: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&h=400&fit=crop&q=90" },
    { keys: ["fridge", "refrigerator"], url: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&h=400&fit=crop&q=90" },
    { keys: ["washing machine", "washer"], url: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&h=400&fit=crop&q=90" },
    // ── CLOTHING ──
    { keys: ["shirt", "t-shirt", "tshirt", "top"], url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=400&fit=crop&q=90" },
    { keys: ["pant", "trouser", "jean", "denim"], url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=400&fit=crop&q=90" },
    { keys: ["shoe", "sneaker", "boot", "footwear"], url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop&q=90" },
    { keys: ["bag", "backpack", "handbag", "purse"], url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop&q=90" },
    { keys: ["jacket", "coat", "hoodie", "sweater"], url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=400&fit=crop&q=90" },
    { keys: ["dress"], url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=400&fit=crop&q=90" },
    { keys: ["glasses", "sunglasses"], url: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&h=400&fit=crop&q=90" },
    // ── FOOD & GROCERY ──
    { keys: ["rice", "basmati"], url: "https://images.unsplash.com/photo-1536304993881-ff86e0c9b956?w=600&h=400&fit=crop&q=90" },
    { keys: ["bread", "roti", "naan"], url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop&q=90" },
    { keys: ["milk", "dairy"], url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&h=400&fit=crop&q=90" },
    { keys: ["egg", "eggs"], url: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&h=400&fit=crop&q=90" },
    { keys: ["oil", "cooking oil"], url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=400&fit=crop&q=90" },
    { keys: ["fruit", "apple", "mango", "banana", "orange"], url: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&h=400&fit=crop&q=90" },
    { keys: ["vegetable", "veggie", "sabzi"], url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=400&fit=crop&q=90" },
    { keys: ["chicken", "meat", "beef", "mutton"], url: "https://images.unsplash.com/photo-1604503468506-a8da13d11bbc?w=600&h=400&fit=crop&q=90" },
    { keys: ["water", "bottle", "drink", "juice", "beverage"], url: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600&h=400&fit=crop&q=90" },
    { keys: ["tea", "chai", "coffee"], url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&q=90" },
    { keys: ["biscuit", "cookie", "snack", "chips"], url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=400&fit=crop&q=90" },
    // ── MEDICINE & HEALTH ──
    { keys: ["medicine", "tablet", "capsule", "syrup", "drug", "pharma"], url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=400&fit=crop&q=90" },
    { keys: ["mask", "sanitizer", "glove"], url: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=600&h=400&fit=crop&q=90" },
    // ── STATIONERY ──
    { keys: ["pen", "pencil", "marker"], url: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&h=400&fit=crop&q=90" },
    { keys: ["book", "notebook", "copy", "register"], url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=400&fit=crop&q=90" },
    // ── TOOLS ──
    { keys: ["tool", "drill", "hammer", "screw", "wrench"], url: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=400&fit=crop&q=90" },
    { keys: ["battery"], url: "https://images.unsplash.com/photo-1620714223084-8fcacc2107ae?w=600&h=400&fit=crop&q=90" },
    // ── SPORTS ──
    { keys: ["ball", "football", "cricket", "tennis", "sport"], url: "https://images.unsplash.com/photo-1546519638405-a9d1b5f1a6db?w=600&h=400&fit=crop&q=90" },
    // ── BEAUTY ──
    { keys: ["shampoo", "soap", "lotion", "cream", "perfume", "beauty"], url: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=400&fit=crop&q=90" },
];

// Fallback — clean generic product shot
const DEFAULT_PRODUCT_IMG = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop&q=90";

const getProductImageUrl = (uploadedSrc, productName) => {
    if (uploadedSrc) {
        return uploadedSrc.startsWith("http")
            ? uploadedSrc
            : `http://localhost:5000${uploadedSrc}`;
    }
    const name = (productName || "").toLowerCase();
    for (const entry of PRODUCT_IMAGE_MAP) {
        if (entry.keys.some((k) => name.includes(k))) {
            return entry.url;
        }
    }
    return DEFAULT_PRODUCT_IMG;
};

const ProductImage = ({ src, productName, className }) => {
    const primary = getProductImageUrl(src, productName);
    const [imgSrc, setImgSrc] = useState(primary);
    const [usedFallback, setUsedFallback] = useState(false);

    const handleError = () => {
        if (!usedFallback) {
            setUsedFallback(true);
            const keyword = getProductImageUrl(null, productName);
            setImgSrc(keyword !== DEFAULT_PRODUCT_IMG ? keyword : DEFAULT_PRODUCT_IMG);
        }
    };

    return (
        <img
            className={className}
            src={imgSrc}
            alt={productName || "product"}
            onError={handleError}
            loading="lazy"
        />
    );
};

window.alert = (msg) => {
    const message = typeof msg === 'string' ? msg : String(msg);
    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes('success') || lowerMsg.includes('confirmed') || lowerMsg.includes('created') || lowerMsg.includes('deleted')) {
        toast.classList.add('toast-success');
    } else if (lowerMsg.includes('fail') || lowerMsg.includes('error') || lowerMsg.includes('wrong') || lowerMsg.includes('empty') || lowerMsg.includes('exceed')) {
        toast.classList.add('toast-error');
    } else {
        toast.classList.add('toast-info');
    }

    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

window.customConfirm = (msg) => {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay confirm-overlay';

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <h2 class="confirm-modal-title">Confirm Action</h2>
            <p class="confirm-modal-text">${msg}</p>
            <div class="modal-actions confirm-modal-actions">
                <button class="btn-primary confirm-modal-btn-yes" id="confirm-yes">Confirm</button>
                <button class="btn-cancel" id="confirm-no">Cancel</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        document.getElementById('confirm-yes').onclick = () => {
            document.body.removeChild(overlay);
            resolve(true);
        };
        document.getElementById('confirm-no').onclick = () => {
            document.body.removeChild(overlay);
            resolve(false);
        };
    });
};

//---------------------------------------
//----------- USER DASHBOARD -----------
//---------------------------------------

const UserDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (!stored) {
            navigate("/UserLogin", { replace: true });
        }
    }, [navigate]);

    const quickCards = [
        {
            label: "Focus",
            value: "Daily",
            detail: "Your stock overview stays in one place",
        },
        {
            label: "Status",
            value: "Live",
            detail: "Always synced for quick checking",
        },
        {
            label: "Usage",
            value: "Smooth",
            detail: "Simple flow for everyday inventory work",
        },
    ];

    return (
        <div>
            <HeaderUser />
            <div className="dashboard-layout">
                <SidebarUser />
                <div className="content">
                    <div className="dashboard-hero">
                        <div>
                            <p className="eyebrow">inventory workspace</p>
                            <h1 className="welcome">Welcome {user?.name || "User"}</h1>
                            <p className="dashboard-subtitle">
                                Keep a clean view of your daily activities, product status, and
                                order flow in one friendly dashboard.
                            </p>
                        </div>
                        <div className="status-chip">Live overview</div>
                    </div>

                    <div className="dashboard-stat-grid">
                        {quickCards.map((item) => (
                            <div className="stat-card" key={item.label}>
                                <div className="stat-card-label">{item.label}</div>
                                <div className="stat-card-value">{item.value}</div>
                                <div className="stat-card-detail">{item.detail}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

//---------------------------------------
//----------- ADMIN DASHBOARD -----------
//---------------------------------------

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });
    const [counts, setCounts] = useState({ products: 0, users: 0, categories: 0, suppliers: 0, receipts: 0 });

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (!stored) {
            navigate("/UserLogin", { replace: true });
            return;
        }
        const token = localStorage.getItem("token");
        fetch("http://localhost:5000/api/dashboardstatus", {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
            .then(res => res.json())
            .then(data => setCounts(data))
            .catch(err => console.error("Failed to load dashboard status", err));
    }, [navigate]);

    const statCards = [
        {
            label: "Users",
            value: counts.users ?? 0,
            detail: "Registered users in the system",
        },
        {
            label: "Products",
            value: counts.products ?? 0,
            detail: "Total managed products",
        },
        {
            label: "Categories",
            value: counts.categories ?? 0,
            detail: "Product categories available",
        },
        {
            label: "Suppliers",
            value: counts.suppliers ?? 0,
            detail: "Total vendors",
        },
        {
            label: "Receipts",
            value: counts.receipts ?? 0,
            detail: "Total generated receipts",
        },
    ];

    return (
        <div>
            <HeaderAdmin />
            <div className="dashboard-layout">
                <SidebarAdmin />
                <div className="content">
                    <div className="dashboard-hero">
                        <div>
                            <p className="eyebrow">admin dashboard</p>
                            <h1 className="welcome">Welcome {user?.name || "User"}</h1>
                            <p className="dashboard-subtitle">
                                A calm, modern overview to handle products, orders, and vendor
                                activity without clutter.
                            </p>
                        </div>
                        <div className="status-chip">Quick glance</div>
                    </div>

                    <div className="dashboard-stat-grid">
                        {statCards.map((item) => (
                            <div className="stat-card" key={item.label}>
                                <div className="stat-card-label">{item.label}</div>
                                <div className="stat-card-value">{item.value}</div>
                                <div className="stat-card-detail">{item.detail}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminDashboardOrders = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [createMode, setCreateMode] = useState(false);
    const [createForm, setCreateForm] = useState({
        supplier_id: "",
        product_id: "",
        quantity: "",
    });
    const navigate = useNavigate();

    const loadOrders = (token) => {
        fetch("http://localhost:5000/api/order", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setOrders(Array.isArray(data) ? data : []))
            .catch(() => { });
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            loadOrders(token);
            fetch("http://localhost:5000/api/product", {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => setProducts(Array.isArray(data) ? data : []))
                .catch(() => { });
            fetch("http://localhost:5000/api/supplier", {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => setSuppliers(Array.isArray(data) ? data : []))
                .catch(() => { });
        } else {
            navigate("/UserLogin", { replace: true });
        }
    }, [navigate]);

    const openCreate = () => {
        setCreateForm({ supplier_id: "", product_id: "", quantity: "" });
        setCreateMode(true);
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");

            const calcRes = await fetch(
                "http://localhost:5000/api/supplier/calculate-total",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        productId: createForm.product_id,
                        quantity: createForm.quantity,
                    }),
                },
            );
            const calcData = await calcRes.json();
            if (!calcRes.ok)
                throw new Error(calcData.message || "Failed to calculate subtotal");

            const payload = { ...createForm, subtotal: calcData.total };

            const res = await fetch("http://localhost:5000/api/order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Order creation failed");
            alert("Order created successfully!");
            setCreateMode(false);
            loadOrders(token);
        } catch (error) {
            alert(error.message || "Order creation failed");
        }
    };

    const handleConfirm = async (orderId) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:5000/api/order/confirmOrder`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ order_id: orderId, status: "Confirmed" }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Confirm failed");
            alert(data.message || "Order confirmed!");
            loadOrders(token);
        } catch (error) {
            alert(error.message || "Confirm failed");
        }
    };

    const handleCancel = async (orderId) => {
        if (!(await window.customConfirm("Are you sure you want to cancel this order?"))) return;
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:5000/api/order/confirmOrder`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ order_id: orderId, status: "Cancelled" }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Cancel failed");
            alert(data.message || "Order cancelled!");
            loadOrders(token);
        } catch (error) {
            alert(error.message || "Cancel failed");
        }
    };

    const getProductName = (id) => {
        const p = products.find((p) => p._id === id);
        return p ? p.product_name : id;
    };

    const getSupplierName = (id) => {
        const s = suppliers.find((s) => s._id === id);
        return s ? s.Name : id;
    };

    return (
        <div>
            <HeaderAdmin />
            <div className="dashboard-layout">
                <SidebarAdmin />
                <div className="content">
                    <h1>Orders</h1>
                    <button className="create-btn" onClick={openCreate}>
                        Create Order
                    </button>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Supplier</th>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Subtotal</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((o) => (
                                <tr key={o._id}>
                                    <td>{getSupplierName(o.supplier_id)}</td>
                                    <td>{getProductName(o.product_id)}</td>
                                    <td>{o.quantity}</td>
                                    <td>{o.subtotal || "-"}</td>
                                    <td>
                                        <span
                                            className={`status-badge status-${o.status?.toLowerCase()}`}
                                        >
                                            {o.status}
                                        </span>
                                    </td>
                                    <td>
                                        {o.status === "Pending" && (
                                            <>
                                                <button
                                                    className="edit-button"
                                                    onClick={() => handleConfirm(o._id)}
                                                >
                                                    Confirm
                                                </button>{" "}
                                                <button
                                                    className="delete-button"
                                                    onClick={() => handleCancel(o._id)}
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        )}
                                        {o.status !== "Pending" && <span>—</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {createMode && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Create Order</h2>
                        <form onSubmit={handleCreateSubmit}>
                            <div className="modal-field">
                                <label>Supplier</label>
                                <select
                                    value={createForm.supplier_id}
                                    onChange={(e) =>
                                        setCreateForm({
                                            ...createForm,
                                            supplier_id: e.target.value,
                                        })
                                    }
                                    required
                                >
                                    <option value="">Select Supplier</option>
                                    {suppliers.filter((s) => s.status === "Confirm").map((s) => (
                                        <option key={s._id} value={s._id}>
                                            {s.Name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-field">
                                <label>Product</label>
                                <select
                                    value={createForm.product_id}
                                    onChange={(e) =>
                                        setCreateForm({ ...createForm, product_id: e.target.value })
                                    }
                                    required
                                >
                                    <option value="">Select Product</option>
                                    {products.map((p) => (
                                        <option key={p._id} value={p._id}>
                                            {p.product_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-field">
                                <label>Quantity</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={createForm.quantity}
                                    onChange={(e) =>
                                        setCreateForm({ ...createForm, quantity: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="btn-primary">
                                    Create
                                </button>
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={() => setCreateMode(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const AdminDashboardProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [editForm, setEditForm] = useState({
        product_name: "",
        product_description: "",
        product_purchase_price: "",
        product_selling_price: "",
        product_stock: "",
        product_category: "",
        product_supplier: "",
        product_image: "",
        product_status: "",
    });
    const [createForm, setCreateForm] = useState({
        product_name: "",
        product_description: "",
        product_purchase_price: "",
        product_selling_price: "",
        product_stock: "",
        product_category: "",
        product_supplier: "",
        product_image: "",
        product_status: "",
    });
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetch("http://localhost:5000/api/product", {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => setProducts(Array.isArray(data) ? data : []))
                .catch(() => { });
            fetch("http://localhost:5000/api/category", {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => setCategories(Array.isArray(data) ? data : []))
                .catch(() => { });
            fetch("http://localhost:5000/api/supplier", {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => setSuppliers(Array.isArray(data) ? data : []))
                .catch(() => { });
        } else {
            navigate("/UserLogin", { replace: true });
        }
    }, [navigate]);
    const edit = (p) => {
        setEditForm({
            ...p,
            product_purchase_price: p.purchase_price,
            product_selling_price: p.selling_price,
            product_stock: p.Stock,
            product_category: p.category?._id || p.category,
            product_supplier: p.supplier?._id || p.supplier,
            product_image: p.image || "",
            product_status: p.status || "",
        });
        setIsEditOpen(true);
    };
    const handleCreateSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!(createForm.product_image instanceof File)) {
            alert("Please choose a product image.");
            return;
        }

        const formData = new FormData();
        formData.append("product_name", createForm.product_name);
        formData.append("product_description", createForm.product_description);
        formData.append(
            "purchase_price",
            Number(createForm.product_purchase_price),
        );
        formData.append("selling_price", Number(createForm.product_selling_price));
        formData.append("Stock", Number(createForm.product_stock));
        formData.append("category", createForm.product_category);
        formData.append("supplier", createForm.product_supplier);
        formData.append("status", createForm.product_status);
        formData.append("image", createForm.product_image);

        fetch("http://localhost:5000/api/product", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert("Product created successfully");
                    setProducts([...products, data]);
                    setIsCreateOpen(false);
                    setCreateForm({
                        product_name: "",
                        product_description: "",
                        product_purchase_price: "",
                        product_selling_price: "",
                        product_stock: "",
                        product_category: "",
                        product_supplier: "",
                        product_image: "",
                        product_status: "",
                    });
                }
            })
            .catch((err) => alert("Something went wrong!"));
    };
    const handleEditSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const formData = new FormData();

        formData.append("product_name", editForm.product_name);
        formData.append("product_description", editForm.product_description);
        formData.append("purchase_price", Number(editForm.product_purchase_price));
        formData.append("selling_price", Number(editForm.product_selling_price));
        formData.append("Stock", Number(editForm.product_stock));
        formData.append("category", editForm.product_category);
        formData.append("supplier", editForm.product_supplier);
        formData.append("status", editForm.product_status);

        if (editForm.product_image instanceof File) {
            formData.append("image", editForm.product_image);
        } else if (editForm.product_image) {
            formData.append("image", editForm.product_image);
        }

        fetch(`http://localhost:5000/api/product/${editForm._id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert("Product updated successfully");
                    setProducts(products.map((p) => (p._id === editForm._id ? data : p)));
                    setIsEditOpen(false);
                    setEditForm({
                        product_name: "",
                        product_description: "",
                        product_purchase_price: "",
                        product_selling_price: "",
                        product_stock: "",
                        product_category: "",
                        product_supplier: "",
                        product_image: "",
                        product_status: "",
                    });
                }
            })
            .catch((err) => alert("Something went wrong!"));
    };
    const handleDelete = async (productId) => {
        if (!(await window.customConfirm("Are you sure you want to delete this product?"))) return;
        const token = localStorage.getItem("token");
        fetch(`http://localhost:5000/api/product/${productId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    alert(data.error);
                } else {
                    setProducts(products.filter((p) => p._id !== productId));
                    alert("Product deleted successfully");
                }
            })
            .catch(() => alert("Something went wrong!"));
    };

    return (
        <div>
            <HeaderAdmin />
            <div className="dashboard-layout">
                <SidebarAdmin />
                <div className="content">
                    <div className="page-header">
                        <h1>Products</h1>
                        <span className="products-count">{products.length} product{products.length !== 1 ? "s" : ""}</span>
                    </div>
                    <button className="create-btn" onClick={() => setIsCreateOpen(true)}>
                        Create Product
                    </button>
                    {isCreateOpen && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <h2>Create Product</h2>
                                <form onSubmit={handleCreateSubmit}>
                                    <div className="modal-field">
                                        <label>Product Name</label>
                                        <input
                                            type="text"
                                            value={createForm.product_name}
                                            onChange={(e) => {
                                                const v = e.target.value.replace(/[^a-zA-Z ]/g, '');
                                                setCreateForm({ ...createForm, product_name: v });
                                            }}
                                            maxLength={50}
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Description</label>
                                        <input
                                            type="text"
                                            value={createForm.product_description}
                                            onChange={(e) => {
                                                const v = e.target.value.replace(/[^a-zA-Z ]/g, '');
                                                setCreateForm({ ...createForm, product_description: v });
                                            }}
                                            maxLength={100}
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Purchase Price</label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={createForm.product_purchase_price}
                                            onChange={(e) => {
                                                const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
                                                setCreateForm({ ...createForm, product_purchase_price: v });
                                            }}
                                            maxLength={11}
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Selling Price</label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={createForm.product_selling_price}
                                            onChange={(e) => {
                                                const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
                                                setCreateForm({ ...createForm, product_selling_price: v });
                                            }}
                                            maxLength={11}
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Stock</label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            min="0"
                                            value={createForm.product_stock}
                                            onChange={(e) => {
                                                const stock = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
                                                setCreateForm({
                                                    ...createForm,
                                                    product_stock: stock,
                                                    product_status: Number(stock) > 0 ? "InStock" : "Sold Out",
                                                });
                                            }}
                                            maxLength={11}
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Category</label>
                                        <select
                                            value={createForm.product_category}
                                            onChange={(e) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    product_category: e.target.value,
                                                })
                                            }
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((c) => (
                                                <option key={c._id} value={c._id}>
                                                    {c.category_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Supplier</label>
                                        <select
                                            value={createForm.product_supplier}
                                            onChange={(e) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    product_supplier: e.target.value,
                                                })
                                            }
                                            required
                                        >
                                            <option value="">Select Supplier</option>
                                            {suppliers.filter((s) => s.status === "Confirm").map((s) => (
                                                <option key={s._id} value={s._id}>
                                                    {s.Name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Image</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    product_image: e.target.files?.[0] || "",
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Status</label>
                                        <select value={createForm.product_status} disabled required>
                                            <option value="">Select Status</option>
                                            <option value="InStock">InStock</option>
                                            <option value="Sold Out">Sold Out</option>
                                        </select>
                                    </div>
                                    <div className="modal-actions">
                                        <button type="submit" className="btn-primary">
                                            Create
                                        </button>
                                        <button
                                            type="button"
                                            className="btn-cancel"
                                            onClick={() => setIsCreateOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                    {isEditOpen && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <h2>Edit Product</h2>
                                <form onSubmit={handleEditSubmit}>
                                    <div className="modal-field">
                                        <label>Product Name</label>
                                        <input
                                            type="text"
                                            value={editForm.product_name}
                                            onChange={(e) => {
                                                const v = e.target.value.replace(/[^a-zA-Z ]/g, '');
                                                setEditForm({ ...editForm, product_name: v });
                                            }}
                                            maxLength={50}
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Description</label>
                                        <input
                                            type="text"
                                            value={editForm.product_description}
                                            onChange={(e) => {
                                                const v = e.target.value.replace(/[^a-zA-Z ]/g, '');
                                                setEditForm({ ...editForm, product_description: v });
                                            }}
                                            maxLength={100}
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Purchase Price</label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={editForm.product_purchase_price}
                                            onChange={(e) => {
                                                const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
                                                setEditForm({ ...editForm, product_purchase_price: v });
                                            }}
                                            maxLength={11}
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Selling Price</label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={editForm.product_selling_price}
                                            onChange={(e) => {
                                                const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
                                                setEditForm({ ...editForm, product_selling_price: v });
                                            }}
                                            maxLength={11}
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Stock</label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            min="0"
                                            value={editForm.product_stock}
                                            onChange={(e) => {
                                                const stock = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
                                                setEditForm({
                                                    ...editForm,
                                                    product_stock: stock,
                                                    product_status: Number(stock) > 0 ? "InStock" : "Sold Out",
                                                });
                                            }}
                                            maxLength={11}
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Category</label>
                                        <select
                                            value={editForm.product_category}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    product_category: e.target.value,
                                                })
                                            }
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((c) => (
                                                <option key={c._id} value={c._id}>
                                                    {c.category_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Supplier</label>
                                        <select
                                            value={editForm.product_supplier}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    product_supplier: e.target.value,
                                                })
                                            }
                                            required
                                        >
                                            <option value="">Select Supplier</option>
                                            {suppliers.filter((s) => s.status === "Confirm").map((s) => (
                                                <option key={s._id} value={s._id}>
                                                    {s.Name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Image</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    product_image: e.target.files?.[0] || "",
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Status</label>
                                        <select value={editForm.product_status} disabled required>
                                            <option value="">Select Status</option>
                                            <option value="InStock">InStock</option>
                                            <option value="Sold Out">Sold Out</option>
                                        </select>
                                    </div>
                                    <div className="modal-actions">
                                        <button type="submit" className="btn-primary">
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            className="btn-cancel"
                                            onClick={() => setIsEditOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                    <div className="products-grid">
                        {products.map((p) => (
                            <div
                                key={p._id}
                                className={`product-card ${p.status === "Sold Out" ? "sold-out" : ""}`}
                            >
                                {/* ── Hero image with overlay ── */}
                                <div className="product-card-img-wrap">
                                    <ProductImage
                                        src={p.image}
                                        productName={p.product_name}
                                        className="product-card-img"
                                    />
                                    {/* dark gradient so text reads clearly on image */}
                                    <div className="product-img-overlay" />
                                    {/* name + status pinned over the image */}
                                    <div className="product-img-info">
                                        <span className={`product-status-badge ${p.status === "Sold Out" ? "badge-sold-out" : "badge-instock"}`}>
                                            {p.status === "Sold Out" ? "⚠ Sold Out" : "✓ In Stock"}
                                        </span>
                                        <h3 className="product-img-title">{p.product_name}</h3>
                                    </div>
                                </div>

                                {/* ── Card body ── */}
                                <div className="product-card-body">
                                    <p className="product-card-desc">{p.product_description}</p>

                                    <div className="product-card-meta">
                                        <div className="product-meta-row">
                                            <span className="meta-label">Selling Price</span>
                                            <span className="meta-value accent">PKR {p.selling_price}</span>
                                        </div>
                                        <div className="product-meta-row">
                                            <span className="meta-label">Purchase Price</span>
                                            <span className="meta-value">PKR {p.purchase_price}</span>
                                        </div>
                                        <div className="product-meta-row">
                                            <span className="meta-label">Stock</span>
                                            <span className={`meta-value ${p.Stock <= 0 ? "danger" : p.Stock < 10 ? "warning" : "success"}`}>
                                                {p.Stock} units
                                            </span>
                                        </div>
                                        <div className="product-meta-row">
                                            <span className="meta-label">Category</span>
                                            <span className="meta-value">{p.category?.category_name || "—"}</span>
                                        </div>
                                        <div className="product-meta-row">
                                            <span className="meta-label">Supplier</span>
                                            <span className="meta-value">{p.supplier?.Name || "—"}</span>
                                        </div>
                                    </div>

                                    <div className="product-card-actions">
                                        <button className="edit-button" onClick={() => edit(p)}>
                                            Edit
                                        </button>
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDelete(p._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminDashboardCategories = () => {
    const [categories, setCategories] = useState([]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [editForm, setEditForm] = useState({
        category_name: "",
        description: "",
    });
    const [createForm, setCreateForm] = useState({
        category_name: "",
        description: "",
    });

    const navigate = useNavigate();

    const loadCategories = (token) => {
        fetch("http://localhost:5000/api/category", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setCategories(Array.isArray(data) ? data : []))
            .catch(() => { });
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            loadCategories(token);
        } else {
            navigate("/UserLogin", { replace: true });
        }
    }, [navigate]);

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (token) {
            fetch("http://localhost:5000/api/category", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(createForm),
            })
                .then((res) => res.json())
                .then((data) => {
                    setCategories([...categories, data]);
                    setIsCreateOpen(false);
                    setCreateForm({ category_name: "", description: "" });
                    alert("Category created successfully");
                })
                .catch(() => alert("Failed to create category"));
        }
    };

    const openEdit = (c) => {
        setCurrentCategory(c._id);
        setEditForm({
            category_name: c.category_name,
            description: c.description,
        });
        setIsEditOpen(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (token) {
            fetch(`http://localhost:5000/api/category/${currentCategory}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(editForm),
            })
                .then((res) => res.json())
                .then((data) => {
                    setCategories(
                        categories.map((c) => (c._id === currentCategory ? data : c)),
                    );
                    setIsEditOpen(false);
                    setCurrentCategory(null);
                    alert("Category updated successfully");
                })
                .catch(() => alert("Failed to update category"));
        }
    };

    const handleDelete = async (id) => {
        if (!(await window.customConfirm("Are you sure you want to delete this category? All related products will also be deleted."))) return;
        const token = localStorage.getItem("token");
        if (token) {
            fetch(`http://localhost:5000/api/category/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => {
                    setCategories(categories.filter((c) => c._id !== id));
                    const productNote = data.deletedProducts > 0 ? ` (${data.deletedProducts} related product(s) also deleted)` : '';
                    alert("Category deleted successfully" + productNote);
                })
                .catch(() => alert("Failed to delete category"));
        }
    };

    return (
        <div>
            <HeaderAdmin />
            <div className="dashboard-layout">
                <SidebarAdmin />
                <div className="content">
                    <h1>Categories</h1>
                    <button className="create-btn" onClick={() => setIsCreateOpen(true)}>
                        Create Category
                    </button>

                    {isCreateOpen && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <h2>Create Category</h2>
                                <form onSubmit={handleCreateSubmit}>
                                    <div className="modal-field">
                                        <label>Category Name</label>
                                        <input
                                            type="text"
                                            value={createForm.category_name}
                                            onChange={(e) => {
                                                const v = e.target.value.replace(/[^a-zA-Z ]/g, '');
                                                setCreateForm({ ...createForm, category_name: v });
                                            }}
                                            maxLength={50}
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Description</label>
                                        <input
                                            type="text"
                                            value={createForm.description}
                                            onChange={(e) => {
                                                const v = e.target.value.replace(/[^a-zA-Z ]/g, '');
                                                setCreateForm({ ...createForm, description: v });
                                            }}
                                            maxLength={100}
                                            required
                                        />
                                    </div>
                                    <div className="modal-actions">
                                        <button
                                            className="btn-cancel"
                                            type="button"
                                            onClick={() => setIsCreateOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button className="btn-primary" type="submit">
                                            Create Category
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {isEditOpen && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <h2>Edit Category</h2>
                                <form onSubmit={handleEditSubmit}>
                                    <div className="modal-field">
                                        <label>Category Name</label>
                                        <input
                                            type="text"
                                            value={editForm.category_name}
                                            onChange={(e) => {
                                                const v = e.target.value.replace(/[^a-zA-Z ]/g, '');
                                                setEditForm({ ...editForm, category_name: v });
                                            }}
                                            maxLength={50}
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Description</label>
                                        <input
                                            type="text"
                                            value={editForm.description}
                                            onChange={(e) => {
                                                const v = e.target.value.replace(/[^a-zA-Z ]/g, '');
                                                setEditForm({ ...editForm, description: v });
                                            }}
                                            maxLength={100}
                                            required
                                        />
                                    </div>
                                    <div className="modal-actions">
                                        <button
                                            className="btn-cancel"
                                            type="button"
                                            onClick={() => setIsEditOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button className="btn-primary" type="submit">
                                            Update Category
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    <table className="table">
                        <thead>
                            <tr>
                                <th>Category Name</th>
                                <th>Category Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((c) => (
                                <tr key={c._id}>
                                    <td>{c.category_name}</td>
                                    <td>{c.description}</td>
                                    <td>
                                        <button className="edit-button" onClick={() => openEdit(c)}>
                                            Edit
                                        </button>{" "}
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDelete(c._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const AdminDashboardSuppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        Name: "",
        company: "",
        phone_number: "",
        status: "",
    });
    const [createForm, setCreateForm] = useState({
        Name: "",
        company: "",
        phone_number: "",
    });
    const navigate = useNavigate();

    const loadSuppliers = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            fetch("http://localhost:5000/api/supplier", {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => setSuppliers(Array.isArray(data) ? data : []))
                .catch(() => { });
        } else {
            navigate("/UserLogin", { replace: true });
        }
    };

    useEffect(() => {
        loadSuppliers();
    }, [navigate]);

    const createSupplier = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (token) {
            fetch("http://localhost:5000/api/supplier", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(createForm),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        setIsCreateOpen(false);
                        setCreateForm({ Name: "", company: "", phone_number: "" });
                        loadSuppliers();
                        alert("Supplier created successfully");
                    }
                })
                .catch(() => alert("Failed to create supplier"));
        } else {
            navigate("/UserLogin", { replace: true });
        }
    };

    const openEdit = (supplier) => {
        setEditForm(supplier);
        setIsEditOpen(true);
    };

    const updateSupplier = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (token) {
            fetch(`http://localhost:5000/api/supplier/${editForm._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(editForm),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        setIsEditOpen(false);
                        loadSuppliers();
                        alert("Supplier updated successfully");
                    }
                })
                .catch(() => alert("Failed to update supplier"));
        } else {
            navigate("/UserLogin", { replace: true });
        }
    };

    const deleteSupplier = async (id) => {
        if (!(await window.customConfirm("Are you sure you want to delete this supplier?"))) return;
        const token = localStorage.getItem("token");
        if (token) {
            fetch(`http://localhost:5000/api/supplier/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        loadSuppliers();
                        alert("Supplier deleted successfully");
                    }
                })
                .catch(() => alert("Failed to delete supplier"));
        } else {
            navigate("/UserLogin", { replace: true });
        }
    };

    return (
        <div>
            <HeaderAdmin />
            <div className="dashboard-layout">
                <SidebarAdmin />
                <div className="content">
                    <h1>Suppliers</h1>
                    <button onClick={() => setIsCreateOpen(true)} className="create-btn">
                        Add Supplier
                    </button>

                    {isCreateOpen && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <h2>Add Supplier</h2>
                                <form onSubmit={createSupplier}>
                                    <div className="modal-field">
                                        <label>Supplier Name</label>
                                        <input
                                            type="text"
                                            value={createForm.Name}
                                            onChange={(e) => {
                                                const v = e.target.value.replace(/[^a-zA-Z ]/g, '');
                                                setCreateForm({ ...createForm, Name: v });
                                            }}
                                            maxLength={50}
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Supplier Phone</label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={createForm.phone_number}
                                            onChange={(e) => {
                                                const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
                                                setCreateForm({ ...createForm, phone_number: v });
                                            }}
                                            maxLength={11}
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Supplier Company</label>
                                        <input
                                            type="text"
                                            value={createForm.company}
                                            onChange={(e) => {
                                                const v = e.target.value.replace(/[^a-zA-Z ]/g, '');
                                                setCreateForm({ ...createForm, company: v });
                                            }}
                                            maxLength={80}
                                            required
                                        />
                                    </div>

                                    <div className="modal-actions">
                                        <button
                                            className="btn-cancel"
                                            type="button"
                                            onClick={() => setIsCreateOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button className="btn-primary" type="submit">
                                            Create
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {isEditOpen && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <h2>Edit Supplier</h2>
                                <form onSubmit={updateSupplier}>
                                    <div className="modal-field">
                                        <label>Supplier Name</label>
                                        <input
                                            type="text"
                                            value={editForm.Name}
                                            onChange={(e) => {
                                                const v = e.target.value.replace(/[^a-zA-Z ]/g, '');
                                                setEditForm({ ...editForm, Name: v });
                                            }}
                                            maxLength={50}
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Supplier Phone</label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={editForm.phone_number}
                                            onChange={(e) => {
                                                const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
                                                setEditForm({ ...editForm, phone_number: v });
                                            }}
                                            maxLength={11}
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Supplier Company</label>
                                        <input
                                            type="text"
                                            value={editForm.company}
                                            onChange={(e) => {
                                                const v = e.target.value.replace(/[^a-zA-Z ]/g, '');
                                                setEditForm({ ...editForm, company: v });
                                            }}
                                            maxLength={80}
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Supplier Status</label>
                                        <select
                                            value={editForm.status}
                                            onChange={(e) =>
                                                setEditForm({ ...editForm, status: e.target.value })
                                            }
                                            required
                                        >
                                            <option value="" disabled>
                                                Select Status
                                            </option>
                                            <option value="Pending">Pending</option>
                                            <option value="Confirm">Confirm</option>
                                            <option value="Cancel">Cancel</option>
                                        </select>
                                    </div>
                                    <div className="modal-actions">
                                        <button
                                            className="btn-cancel"
                                            type="button"
                                            onClick={() => setIsEditOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button className="btn-primary" type="submit">
                                            Update
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Supplier Name</th>
                                <th>Supplier Phone</th>
                                <th>Supplier Company</th>
                                <th>Supplier Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers.map((s) => (
                                <tr key={s._id}>
                                    <td>{s.Name}</td>
                                    <td>{s.phone_number}</td>
                                    <td>{s.company}</td>
                                    <td>{s.status}</td>
                                    <td>
                                        <button className="edit-button" onClick={() => openEdit(s)}>
                                            Edit
                                        </button>{" "}
                                        <button
                                            className="delete-button"
                                            onClick={() => deleteSupplier(s._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const AdminDashboardCheckout = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [cart, setCart] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [receipts, setReceipts] = useState([]);
    const [showReceipts, setShowReceipts] = useState(false);
    const [loading, setLoading] = useState(false);
    const [printReceipt, setPrintReceipt] = useState(null);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [reportType, setReportType] = useState("week");
    const [reportData, setReportData] = useState(null);
    const navigate = useNavigate();

    const loadProducts = (token) => {
        fetch("http://localhost:5000/api/product", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setProducts(Array.isArray(data) ? data : []))
            .catch(() => { });
    };

    const loadReceipts = (token) => {
        fetch("http://localhost:5000/api/receipt", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setReceipts(Array.isArray(data) ? data : []))
            .catch(() => { });
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            loadProducts(token);
            loadReceipts(token);
        } else {
            navigate("/UserLogin", { replace: true });
        }
    }, [navigate]);

    const addToCart = (product) => {
        if (product.status === "Sold Out" || product.Stock <= 0) {
            alert("This product is out of stock.");
            return;
        }
        const existing = cart.find((i) => i._id === product._id);
        if (existing) {
            if (existing.qty >= product.Stock) {
                alert("Cannot exceed available stock.");
                return;
            }
            setCart(
                cart.map((i) => (i._id === product._id ? { ...i, qty: i.qty + 1 } : i)),
            );
        } else {
            setCart([...cart, { ...product, qty: 1 }]);
        }
    };

    const updateQty = (_id, delta) => {
        setCart((prev) =>
            prev
                .map((i) => {
                    if (i._id !== _id) return i;
                    const newQty = i.qty + delta;
                    if (newQty <= 0) return null;
                    if (newQty > i.Stock) {
                        alert("Cannot exceed available stock.");
                        return i;
                    }
                    return { ...i, qty: newQty };
                })
                .filter(Boolean),
        );
    };

    const removeFromCart = (_id) => {
        setCart(cart.filter((i) => i._id !== _id));
    };

    const placeOrder = async () => {
        if (cart.length === 0) {
            alert("Cart is empty.");
            return;
        }
        const token = localStorage.getItem("token");
        const userRaw = localStorage.getItem("user");
        if (!token || !userRaw) {
            navigate("/UserLogin", { replace: true });
            return;
        }
        const user = JSON.parse(userRaw);

        setLoading(true);
        try {
            const items = cart.map(item => ({
                ProductDetail: item._id,
                quantity: item.qty
            }));

            const res = await fetch("http://localhost:5000/api/receipt", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    User: user._id,
                    items,
                    paymentMethod,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || data.message || "Receipt creation failed");
            }
            const receiptId = data._id;

            for (const item of cart) {
                await fetch("http://localhost:5000/api/product/stock/remove", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ product_id: item._id, quantity: item.qty }),
                });
            }

            alert("Order placed successfully! Receipt created.");
            setCart([]);
            loadProducts(token);
            loadReceipts(token);

            if (receiptId) {
                handlePrintReceipt(receiptId);
            }
        } catch (err) {
            alert(err.message || "Failed to place order.");
        } finally {
            setLoading(false);
        }
    };

    const handlePrintReceipt = async (receiptId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/UserLogin", { replace: true });
            return;
        }

        try {
            const res = await fetch(
                `http://localhost:5000/api/receipt/${receiptId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            if (!res.ok) throw new Error("Failed to fetch receipt");
            const data = await res.json();
            setPrintReceipt(data);
            setShowPrintModal(true);
        } catch (err) {
            alert("Failed to fetch receipt for printing");
        }
    };

    const fetchReport = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/UserLogin", { replace: true });
            return;
        }
        try {
            const res = await fetch(
                `http://localhost:5000/api/receipt/report?type=${reportType}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            const data = await res.json();
            if (!res.ok)
                throw new Error(
                    data.message || data.error || "Failed to generate report",
                );
            setReportData(data);
        } catch (err) {
            alert(err.message);
        }
    };

    const grandTotal = cart.reduce((sum, i) => sum + i.selling_price * i.qty, 0);

    return (
        <div>
            <HeaderAdmin />
            <div className="dashboard-layout">
                <SidebarAdmin />
                <div className="content">
                    <h1>Checkout / POS</h1>
                    <div className="checkout-search-container">
                        <input
                            type="text"
                            placeholder="Type product name to search and add to cart..."
                            className="modal-field checkout-search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery.trim() && (
                            <div className="search-autocomplete-dropdown">
                                {products
                                    .filter((p) =>
                                        (p.product_name || "")
                                            .toLowerCase()
                                            .includes(searchQuery.toLowerCase()),
                                    )
                                    .slice(0, 15)
                                    .map((p) => (
                                        <div
                                            key={p._id}
                                            onClick={() => {
                                                addToCart(p);
                                                setSearchQuery("");
                                            }}
                                            className="autocomplete-item"
                                        >
                                            <div className="autocomplete-item-name">
                                                {p.product_name}
                                            </div>
                                            <div
                                                className={`autocomplete-item-stock ${p.Stock > 0 && p.status !== "Sold Out" ? "stock-in" : "stock-out"}`}
                                            >
                                                {p.Stock > 0 && p.status !== "Sold Out"
                                                    ? `PKR ${p.selling_price} | Stock: ${p.Stock}`
                                                    : "Out of Stock"}
                                            </div>
                                        </div>
                                    ))}
                                {products.filter((p) =>
                                    (p.product_name || "")
                                        .toLowerCase()
                                        .includes(searchQuery.toLowerCase()),
                                ).length === 0 && (
                                        <div className="autocomplete-item autocomplete-item-empty">
                                            <div className="autocomplete-item-name autocomplete-empty-text">
                                                No products found.
                                            </div>
                                        </div>
                                    )}
                            </div>
                        )}
                    </div>

                    <h2>Cart</h2>
                    {cart.length === 0 ? (
                        <p className="empty-cart-msg">Cart is empty. Add products above.</p>
                    ) : (
                        <>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Unit Price</th>
                                        <th>Quantity</th>
                                        <th>Line Total</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.map((item) => (
                                        <tr key={item._id}>
                                            <td>{item.product_name}</td>
                                            <td>PKR {item.selling_price}</td>
                                            <td>
                                                <button
                                                    className="edit-button"
                                                    onClick={() => updateQty(item._id, -1)}
                                                >
                                                    −
                                                </button>{" "}
                                                {item.qty}{" "}
                                                <button
                                                    className="edit-button"
                                                    onClick={() => updateQty(item._id, 1)}
                                                >
                                                    +
                                                </button>
                                            </td>
                                            <td>PKR {(item.selling_price * item.qty).toFixed(2)}</td>
                                            <td>
                                                <button
                                                    className="delete-button"
                                                    onClick={() => removeFromCart(item._id)}
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="checkout-actions">
                                <h3>Grand Total: PKR {grandTotal.toFixed(2)}</h3>
                                <div className="modal-field inline-field">
                                    <label>Payment Method</label>
                                    <select
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    >
                                        <option value="Cash">Cash</option>
                                        <option value="Card">Card</option>
                                        <option value="Online Transfer">Online Transfer</option>
                                    </select>
                                </div>
                                <button
                                    className="create-btn"
                                    onClick={placeOrder}
                                    disabled={loading}
                                >
                                    {loading ? "Processing..." : "Place Order"}
                                </button>
                            </div>
                        </>
                    )}

                    <div className="receipt-history-section report-section">
                        <h2>Sales Report</h2>
                        <div className="report-controls">
                            <select
                                className="modal-field report-select"
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                            >
                                <option value="week">Past Week</option>
                                <option value="month">Past Month</option>
                                <option value="year">Past Year</option>
                            </select>
                            <button className="create-btn" onClick={fetchReport}>
                                Generate Report
                            </button>
                        </div>
                        {reportData && (
                            <div className="report-results">
                                <h3 className="report-results-title">
                                    {reportData.reportType.toUpperCase()} REPORT
                                </h3>
                                <p className="report-results-text">
                                    <strong>Total Receipts:</strong> {reportData.totalReceipts}
                                </p>
                                <p className="report-results-total">
                                    <strong>Total Sales:</strong> PKR {reportData.totalSales}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="receipt-history-section">
                        <button
                            className="edit-button"
                            onClick={() => setShowReceipts(!showReceipts)}
                        >
                            {showReceipts ? "Hide" : "Show"} Receipt History (
                            {receipts.length})
                        </button>
                        {showReceipts && (
                            <table className="table receipt-table">
                                <thead>
                                    <tr>
                                        <th>Receipt ID</th>
                                        <th>User</th>
                                        <th>Product</th>
                                        <th>Total (PKR)</th>
                                        <th>Payment Method</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {receipts.map((r) => (
                                        <tr key={r._id}>
                                            <td className="receipt-id-cell">#{r._id.slice(-6)}</td>
                                            <td>{r.User?.name || r.User}</td>
                                            <td>
                                                {r.items && r.items.length > 0 ? (
                                                    r.items.map((item, idx) => (
                                                        <div key={idx}>
                                                            {item.ProductDetail?.product_name || "Unknown Product"} x {item.quantity}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <>{r.ProductDetail?.product_name || "Unknown Product"} x {r.quantity || 0}</>
                                                )}
                                            </td>
                                            <td>PKR {r.total}</td>
                                            <td>{r.paymentMethod}</td>
                                            <td>
                                                <button
                                                    className="print-btn"
                                                    onClick={() => handlePrintReceipt(r._id)}
                                                >
                                                    Show Receipt
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {showPrintModal && printReceipt && printReceipt.receipt && (
                    <div className="modal-overlay">
                        <div className="modal print-modal">
                            <h2 className="print-modal-header">Receipt</h2>
                            <div className="print-modal-row">
                                <strong>Receipt ID:</strong> {printReceipt.receipt._id.slice(-8).toUpperCase()}
                            </div>
                            <div className="print-modal-row">
                                <strong>Payment Method:</strong>{" "}
                                {printReceipt.receipt.paymentMethod}
                            </div>
                            <div className="print-modal-row">
                                <strong>Products:</strong>
                                <ul className="print-modal-list">
                                    {printReceipt.receipt.items?.map((item, idx) => (
                                        <li key={idx} className="print-modal-list-item">
                                            {item.ProductDetail?.product_name || "Unknown"} x {item.quantity}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="print-modal-total">
                                <strong>Total:</strong> PKR {printReceipt.receipt.total}
                            </div>
                            <div className="print-modal-actions">
                                <button className="btn-primary" onClick={() => window.print()}>
                                    Print
                                </button>
                                <button
                                    className="btn-cancel"
                                    onClick={() => setShowPrintModal(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

//---------------------------------------
//-------- SUPER ADMIN DASHBOARD --------
//---------------------------------------

const SuperAdminDashboardUsers = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({ name: "", email: "", role: "" });
    const [createMode, setCreateMode] = useState(false);
    const [createForm, setCreateForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "",
    });
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const loadUsers = (token) => {
        fetch("http://localhost:5000/api/user", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setUsers(Array.isArray(data) ? data : []))
            .catch(() => { });
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            loadUsers(token);
            fetch("http://localhost:5000/api/role", {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => setRoles(Array.isArray(data) ? data : []))
                .catch(() => { });
        } else {
            navigate("/UserLogin", { replace: true });
        }
    }, [navigate]);

    const openEdit = (user) => {
        setEditingUser(user);
        setEditForm({
            name: user.name,
            email: user.email,
            role: user.role?._id || user.role,
        });
    };

    const saveEdit = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:5000/api/user/${editingUser._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(editForm),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || data.message || "User update failed");
            }
            setUsers(users.map((u) => (u._id === data._id ? { ...u, ...data } : u)));
            setEditingUser(null);
            alert("User updated successfully");
        } catch (error) {
            alert(error.message || "User update failed");
        }
    };

    const DeleteUser = async (userId) => {
        if (!(await window.customConfirm("Are you sure you want to delete this user?"))) return;
        const token = localStorage.getItem("token");
        fetch(`http://localhost:5000/api/user/${userId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    alert(data.error);
                } else {
                    setUsers(users.filter((u) => u._id !== userId));
                    alert("User deleted successfully");
                }
            })
            .catch(() => alert("Something went wrong!"));
    };

    const openCreate = () => {
        setCreateForm({ name: "", email: "", password: "", role: "" });
        setCreateMode(true);
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(createForm),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "User creation failed");
            alert("User created successfully!");
            setCreateMode(false);
            loadUsers(token);
        } catch (error) {
            alert(error.message || "User creation failed");
        }
    };
    const getRoleName = (roleId) => {
        const r = roles.find((role) => role._id === roleId);
        return r ? r.roleName : roleId;
    };

    return (
        <div>
            <HeaderSuperAdmin />
            <div className="dashboard-layout">
                <SidebarSuperAdmin />
                <div className="content">
                    <h1>Users</h1>
                    <button className="create-btn" onClick={openCreate}>
                        Create User
                    </button>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>User Name</th>
                                <th>User Email</th>
                                <th>User Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u._id}>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{getRoleName(u.role)}</td>
                                    <td>
                                        <button className="edit-button" onClick={() => openEdit(u)}>
                                            Edit
                                        </button>{" "}
                                        <button
                                            className="delete-button"
                                            onClick={() => DeleteUser(u._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {editingUser && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Edit User</h2>
                        <div className="modal-field">
                            <label>Name</label>
                            <input
                                type="text"
                                value={editForm.name}
                                onChange={(e) => {
                                    const v = e.target.value.replace(/[^a-zA-Z ]/g, '');
                                    setEditForm({ ...editForm, name: v });
                                }}
                                maxLength={50}
                            />
                        </div>
                        <div className="modal-field">
                            <label>Email</label>
                            <input
                                type="email"
                                value={editForm.email}
                                onChange={(e) =>
                                    setEditForm({ ...editForm, email: e.target.value })
                                }
                            />
                        </div>
                        <div className="modal-field">
                            <label>Role</label>
                            <select
                                value={editForm.role}
                                onChange={(e) =>
                                    setEditForm({ ...editForm, role: e.target.value })
                                }
                            >
                                {roles.map((r) => (
                                    <option key={r._id} value={r._id}>
                                        {r.roleName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-primary" onClick={saveEdit}>
                                Save
                            </button>
                            <button
                                className="btn-cancel"
                                onClick={() => setEditingUser(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {createMode && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Create User</h2>
                        <form onSubmit={handleCreateSubmit}>
                            <div className="modal-field">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={createForm.name}
                                    onChange={(e) => {
                                        const v = e.target.value.replace(/[^a-zA-Z ]/g, '');
                                        setCreateForm({ ...createForm, name: v });
                                    }}
                                    maxLength={50}
                                    required
                                />
                            </div>
                            <div className="modal-field">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={createForm.email}
                                    onChange={(e) =>
                                        setCreateForm({ ...createForm, email: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="modal-field">
                                <label>Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={createForm.password}
                                        onChange={(e) =>
                                            setCreateForm({ ...createForm, password: e.target.value })
                                        }
                                        required
                                        className="password-input"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="password-toggle-btn"
                                        title={showPassword ? "Hide Password" : "Show Password"}
                                    >
                                        {showPassword ? "🙈" : "👁️"}
                                    </button>
                                </div>
                            </div>
                            <div className="modal-field">
                                <label>Role</label>
                                <select
                                    value={createForm.role}
                                    onChange={(e) =>
                                        setCreateForm({ ...createForm, role: e.target.value })
                                    }
                                    required
                                >
                                    <option value="">Select Role</option>
                                    {roles.map((r) => (
                                        <option key={r._id} value={r._id}>
                                            {r.roleName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="btn-primary">
                                    Create
                                </button>
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={() => setCreateMode(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const SuperAdminDashboardProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [editForm, setEditForm] = useState({
        product_name: "",
        product_description: "",
        product_purchase_price: "",
        product_selling_price: "",
        product_stock: "",
        product_category: "",
        product_supplier: "",
        product_image: "",
        product_status: "",
    });
    const [createForm, setCreateForm] = useState({
        product_name: "",
        product_description: "",
        product_purchase_price: "",
        product_selling_price: "",
        product_stock: "",
        product_category: "",
        product_supplier: "",
        product_image: "",
        product_status: "",
    });
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetch("http://localhost:5000/api/product", {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => setProducts(Array.isArray(data) ? data : []))
                .catch(() => { });
            fetch("http://localhost:5000/api/category", {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => setCategories(Array.isArray(data) ? data : []))
                .catch(() => { });
            fetch("http://localhost:5000/api/supplier", {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => setSuppliers(Array.isArray(data) ? data : []))
                .catch(() => { });
        } else {
            navigate("/UserLogin", { replace: true });
        }
    }, [navigate]);
    const edit = (p) => {
        setEditForm({
            ...p,
            product_purchase_price: p.purchase_price,
            product_selling_price: p.selling_price,
            product_stock: p.Stock,
            product_category: p.category?._id || p.category,
            product_supplier: p.supplier?._id || p.supplier,
            product_image: p.image || "",
            product_status: p.status || "",
        });
        setIsEditOpen(true);
    };
    const handleCreateSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!(createForm.product_image instanceof File)) {
            alert("Please choose a product image.");
            return;
        }

        const formData = new FormData();
        formData.append("product_name", createForm.product_name);
        formData.append("product_description", createForm.product_description);
        formData.append(
            "purchase_price",
            Number(createForm.product_purchase_price),
        );
        formData.append("selling_price", Number(createForm.product_selling_price));
        formData.append("Stock", Number(createForm.product_stock));
        formData.append("category", createForm.product_category);
        formData.append("supplier", createForm.product_supplier);
        formData.append("status", createForm.product_status);
        formData.append("image", createForm.product_image);

        fetch("http://localhost:5000/api/product", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert("Product created successfully");
                    setProducts([...products, data]);
                    setIsCreateOpen(false);
                    setCreateForm({
                        product_name: "",
                        product_description: "",
                        product_purchase_price: "",
                        product_selling_price: "",
                        product_stock: "",
                        product_category: "",
                        product_supplier: "",
                        product_image: "",
                        product_status: "",
                    });
                }
            })
            .catch((err) => alert("Something went wrong!"));
    };
    const handleEditSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const formData = new FormData();

        formData.append("product_name", editForm.product_name);
        formData.append("product_description", editForm.product_description);
        formData.append("purchase_price", Number(editForm.product_purchase_price));
        formData.append("selling_price", Number(editForm.product_selling_price));
        formData.append("Stock", Number(editForm.product_stock));
        formData.append("category", editForm.product_category);
        formData.append("supplier", editForm.product_supplier);
        formData.append("status", editForm.product_status);

        if (editForm.product_image instanceof File) {
            formData.append("image", editForm.product_image);
        } else if (editForm.product_image) {
            formData.append("image", editForm.product_image);
        }

        fetch(`http://localhost:5000/api/product/${editForm._id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert("Product updated successfully");
                    setProducts(products.map((p) => (p._id === editForm._id ? data : p)));
                    setIsEditOpen(false);
                    setEditForm({
                        product_name: "",
                        product_description: "",
                        product_purchase_price: "",
                        product_selling_price: "",
                        product_stock: "",
                        product_category: "",
                        product_supplier: "",
                        product_image: "",
                        product_status: "",
                    });
                }
            })
            .catch((err) => alert("Something went wrong!"));
    };
    const handleDelete = async (productId) => {
        if (!(await window.customConfirm("Are you sure you want to delete this product?"))) return;
        const token = localStorage.getItem("token");
        fetch(`http://localhost:5000/api/product/${productId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    alert(data.error);
                } else {
                    setProducts(products.filter((p) => p._id !== productId));
                    alert("Product deleted successfully");
                }
            })
            .catch(() => alert("Something went wrong!"));
    };
    return (
        <div>
            <HeaderSuperAdmin />
            <div className="dashboard-layout">
                <SidebarSuperAdmin />
                <div className="content">
                    <div className="page-header">
                        <h1>Products</h1>
                        <span className="products-count">{products.length} product{products.length !== 1 ? "s" : ""}</span>
                    </div>
                    <button className="create-btn" onClick={() => setIsCreateOpen(true)}>
                        Create Product
                    </button>
                    {isCreateOpen && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <h2>Create Product</h2>
                                <form onSubmit={handleCreateSubmit}>
                                    <div className="modal-field">
                                        <label>Product Name</label>
                                        <input
                                            type="text"
                                            value={createForm.product_name}
                                            onChange={(e) => {
                                                const v = e.target.value.replace(/[^a-zA-Z ]/g, '');
                                                setCreateForm({ ...createForm, product_name: v });
                                            }}
                                            maxLength={50}
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Description</label>
                                        <input
                                            type="text"
                                            value={createForm.product_description}
                                            onChange={(e) => {
                                                const v = e.target.value.replace(/[^a-zA-Z ]/g, '');
                                                setCreateForm({ ...createForm, product_description: v });
                                            }}
                                            maxLength={100}
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Purchase Price</label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={createForm.product_purchase_price}
                                            onChange={(e) => {
                                                const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
                                                setCreateForm({ ...createForm, product_purchase_price: v });
                                            }}
                                            maxLength={11}
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Selling Price</label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={createForm.product_selling_price}
                                            onChange={(e) => {
                                                const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
                                                setCreateForm({ ...createForm, product_selling_price: v });
                                            }}
                                            maxLength={11}
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Stock</label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            min="0"
                                            value={createForm.product_stock}
                                            onChange={(e) => {
                                                const stock = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
                                                setCreateForm({
                                                    ...createForm,
                                                    product_stock: stock,
                                                    product_status: Number(stock) > 0 ? "InStock" : "Sold Out",
                                                });
                                            }}
                                            maxLength={11}
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Category</label>
                                        <select
                                            value={createForm.product_category}
                                            onChange={(e) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    product_category: e.target.value,
                                                })
                                            }
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((c) => (
                                                <option key={c._id} value={c._id}>
                                                    {c.category_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Supplier</label>
                                        <select
                                            value={createForm.product_supplier}
                                            onChange={(e) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    product_supplier: e.target.value,
                                                })
                                            }
                                            required
                                        >
                                            <option value="">Select Supplier</option>
                                            {suppliers.filter((s) => s.status === "Confirm").map((s) => (
                                                <option key={s._id} value={s._id}>
                                                    {s.Name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Image</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    product_image: e.target.files?.[0] || "",
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Status</label>
                                        <select value={createForm.product_status} disabled required>
                                            <option value="">Select Status</option>
                                            <option value="InStock">InStock</option>
                                            <option value="Sold Out">Sold Out</option>
                                        </select>
                                    </div>
                                    <div className="modal-actions">
                                        <button type="submit" className="btn-primary">
                                            Create
                                        </button>
                                        <button
                                            type="button"
                                            className="btn-cancel"
                                            onClick={() => setIsCreateOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                    {isEditOpen && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <h2>Edit Product</h2>
                                <form onSubmit={handleEditSubmit}>
                                    <div className="modal-field">
                                        <label>Product Name</label>
                                        <input
                                            type="text"
                                            value={editForm.product_name}
                                            onChange={(e) => {
                                                const v = e.target.value.replace(/[^a-zA-Z ]/g, '');
                                                setEditForm({ ...editForm, product_name: v });
                                            }}
                                            maxLength={50}
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Description</label>
                                        <input
                                            type="text"
                                            value={editForm.product_description}
                                            onChange={(e) => {
                                                const v = e.target.value.replace(/[^a-zA-Z ]/g, '');
                                                setEditForm({ ...editForm, product_description: v });
                                            }}
                                            maxLength={100}
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Purchase Price</label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={editForm.product_purchase_price}
                                            onChange={(e) => {
                                                const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
                                                setEditForm({ ...editForm, product_purchase_price: v });
                                            }}
                                            maxLength={11}
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Selling Price</label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={editForm.product_selling_price}
                                            onChange={(e) => {
                                                const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
                                                setEditForm({ ...editForm, product_selling_price: v });
                                            }}
                                            maxLength={11}
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Stock</label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            min="0"
                                            value={editForm.product_stock}
                                            onChange={(e) => {
                                                const stock = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
                                                setEditForm({
                                                    ...editForm,
                                                    product_stock: stock,
                                                    product_status: Number(stock) > 0 ? "InStock" : "Sold Out",
                                                });
                                            }}
                                            maxLength={11}
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Category</label>
                                        <select
                                            value={editForm.product_category}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    product_category: e.target.value,
                                                })
                                            }
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((c) => (
                                                <option key={c._id} value={c._id}>
                                                    {c.category_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Supplier</label>
                                        <select
                                            value={editForm.product_supplier}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    product_supplier: e.target.value,
                                                })
                                            }
                                            required
                                        >
                                            <option value="">Select Supplier</option>
                                            {suppliers.filter((s) => s.status === "Confirm").map((s) => (
                                                <option key={s._id} value={s._id}>
                                                    {s.Name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Image</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    product_image: e.target.files?.[0] || "",
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Status</label>
                                        <select value={editForm.product_status} disabled required>
                                            <option value="">Select Status</option>
                                            <option value="InStock">InStock</option>
                                            <option value="Sold Out">Sold Out</option>
                                        </select>
                                    </div>
                                    <div className="modal-actions">
                                        <button type="submit" className="btn-primary">
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            className="btn-cancel"
                                            onClick={() => setIsEditOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                    <div className="products-grid">
                        {products.map((p) => (
                            <div
                                key={p._id}
                                className={`product-card ${p.status === "Sold Out" ? "sold-out" : ""}`}
                            >
                                {/* ── Hero image with overlay ── */}
                                <div className="product-card-img-wrap">
                                    <ProductImage
                                        src={p.image}
                                        productName={p.product_name}
                                        className="product-card-img"
                                    />
                                    <div className="product-img-overlay" />
                                    <div className="product-img-info">
                                        <span className={`product-status-badge ${p.status === "Sold Out" ? "badge-sold-out" : "badge-instock"}`}>
                                            {p.status === "Sold Out" ? "⚠ Sold Out" : "✓ In Stock"}
                                        </span>
                                        <h3 className="product-img-title">{p.product_name}</h3>
                                    </div>
                                </div>

                                {/* ── Card body ── */}
                                <div className="product-card-body">
                                    <p className="product-card-desc">{p.product_description}</p>

                                    <div className="product-card-meta">
                                        <div className="product-meta-row">
                                            <span className="meta-label">Selling Price</span>
                                            <span className="meta-value accent">PKR {p.selling_price}</span>
                                        </div>
                                        <div className="product-meta-row">
                                            <span className="meta-label">Purchase Price</span>
                                            <span className="meta-value">PKR {p.purchase_price}</span>
                                        </div>
                                        <div className="product-meta-row">
                                            <span className="meta-label">Stock</span>
                                            <span className={`meta-value ${p.Stock <= 0 ? "danger" : p.Stock < 10 ? "warning" : "success"}`}>
                                                {p.Stock} units
                                            </span>
                                        </div>
                                        <div className="product-meta-row">
                                            <span className="meta-label">Category</span>
                                            <span className="meta-value">{p.category?.category_name || "—"}</span>
                                        </div>
                                        <div className="product-meta-row">
                                            <span className="meta-label">Supplier</span>
                                            <span className="meta-value">{p.supplier?.Name || "—"}</span>
                                        </div>
                                    </div>

                                    <div className="product-card-actions">
                                        <button className="edit-button" onClick={() => edit(p)}>
                                            Edit
                                        </button>
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDelete(p._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const SuperAdminDashboardCategories = () => {
    const [categories, setCategories] = useState([]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [editForm, setEditForm] = useState({
        category_name: "",
        description: "",
    });
    const [createForm, setCreateForm] = useState({
        category_name: "",
        description: "",
    });

    const navigate = useNavigate();

    const loadCategories = (token) => {
        fetch("http://localhost:5000/api/category", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setCategories(Array.isArray(data) ? data : []))
            .catch(() => { });
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            loadCategories(token);
        } else {
            navigate("/UserLogin", { replace: true });
        }
    }, [navigate]);

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (token) {
            fetch("http://localhost:5000/api/category", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(createForm),
            })
                .then((res) => res.json())
                .then((data) => {
                    setCategories([...categories, data]);
                    setIsCreateOpen(false);
                    setCreateForm({ category_name: "", description: "" });
                    alert("Category created successfully");
                })
                .catch(() => alert("Failed to create category"));
        }
    };

    const openEdit = (c) => {
        setCurrentCategory(c._id);
        setEditForm({
            category_name: c.category_name,
            description: c.description,
        });
        setIsEditOpen(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (token) {
            fetch(`http://localhost:5000/api/category/${currentCategory}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(editForm),
            })
                .then((res) => res.json())
                .then((data) => {
                    setCategories(
                        categories.map((c) => (c._id === currentCategory ? data : c)),
                    );
                    setIsEditOpen(false);
                    setCurrentCategory(null);
                    alert("Category updated successfully");
                })
                .catch(() => alert("Failed to update category"));
        }
    };

    const handleDelete = async (id) => {
        if (!(await window.customConfirm("Are you sure you want to delete this category? All related products will also be deleted."))) return;
        const token = localStorage.getItem("token");
        if (token) {
            fetch(`http://localhost:5000/api/category/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => {
                    setCategories(categories.filter((c) => c._id !== id));
                    const productNote = data.deletedProducts > 0 ? ` (${data.deletedProducts} related product(s) also deleted)` : '';
                    alert("Category deleted successfully" + productNote);
                })
                .catch(() => alert("Failed to delete category"));
        }
    };

    return (
        <div>
            <HeaderSuperAdmin />
            <div className="dashboard-layout">
                <SidebarSuperAdmin />
                <div className="content">
                    <h1>Categories</h1>
                    <button className="create-btn" onClick={() => setIsCreateOpen(true)}>
                        Create Category
                    </button>

                    {isCreateOpen && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <h2>Create Category</h2>
                                <form onSubmit={handleCreateSubmit}>
                                    <div className="modal-field">
                                        <label>Category Name</label>
                                        <input
                                            type="text"
                                            value={createForm.category_name}
                                            onChange={(e) => {
                                                const v = e.target.value.replace(/[^a-zA-Z ]/g, '');
                                                setCreateForm({ ...createForm, category_name: v });
                                            }}
                                            maxLength={50}
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Description</label>
                                        <input
                                            type="text"
                                            value={createForm.description}
                                            onChange={(e) => {
                                                const v = e.target.value.replace(/[^a-zA-Z ]/g, '');
                                                setCreateForm({ ...createForm, description: v });
                                            }}
                                            maxLength={100}
                                            required
                                        />
                                    </div>
                                    <div className="modal-actions">
                                        <button
                                            className="btn-cancel"
                                            type="button"
                                            onClick={() => setIsCreateOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button className="btn-primary" type="submit">
                                            Create Category
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {isEditOpen && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <h2>Edit Category</h2>
                                <form onSubmit={handleEditSubmit}>
                                    <div className="modal-field">
                                        <label>Category Name</label>
                                        <input
                                            type="text"
                                            value={editForm.category_name}
                                            onChange={(e) => {
                                                const v = e.target.value.replace(/[^a-zA-Z ]/g, '');
                                                setEditForm({ ...editForm, category_name: v });
                                            }}
                                            maxLength={50}
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Description</label>
                                        <input
                                            type="text"
                                            value={editForm.description}
                                            onChange={(e) => {
                                                const v = e.target.value.replace(/[^a-zA-Z ]/g, '');
                                                setEditForm({ ...editForm, description: v });
                                            }}
                                            maxLength={100}
                                            required
                                        />
                                    </div>
                                    <div className="modal-actions">
                                        <button
                                            className="btn-cancel"
                                            type="button"
                                            onClick={() => setIsEditOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button className="btn-primary" type="submit">
                                            Update Category
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    <table className="table">
                        <thead>
                            <tr>
                                <th>Category Name</th>
                                <th>Category Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((c) => (
                                <tr key={c._id}>
                                    <td>{c.category_name}</td>
                                    <td>{c.description}</td>
                                    <td>
                                        <button className="edit-button" onClick={() => openEdit(c)}>
                                            Edit
                                        </button>{" "}
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDelete(c._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const SuperAdminDashboardSuppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        Name: "",
        company: "",
        phone_number: "",
        status: "",
    });
    const [createForm, setCreateForm] = useState({
        Name: "",
        company: "",
        phone_number: "",
    });
    const navigate = useNavigate();

    const loadSuppliers = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            fetch("http://localhost:5000/api/supplier", {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => setSuppliers(Array.isArray(data) ? data : []))
                .catch(() => { });
        } else {
            navigate("/UserLogin", { replace: true });
        }
    };

    useEffect(() => {
        loadSuppliers();
    }, [navigate]);

    const createSupplier = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (token) {
            fetch("http://localhost:5000/api/supplier", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(createForm),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        setIsCreateOpen(false);
                        setCreateForm({ Name: "", company: "", phone_number: "" });
                        loadSuppliers();
                        alert("Supplier created successfully");
                    }
                })
                .catch(() => alert("Failed to create supplier"));
        } else {
            navigate("/UserLogin", { replace: true });
        }
    };

    const openEdit = (supplier) => {
        setEditForm(supplier);
        setIsEditOpen(true);
    };

    const updateSupplier = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (token) {
            fetch(`http://localhost:5000/api/supplier/${editForm._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(editForm),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        setIsEditOpen(false);
                        loadSuppliers();
                        alert("Supplier updated successfully");
                    }
                })
                .catch(() => alert("Failed to update supplier"));
        } else {
            navigate("/UserLogin", { replace: true });
        }
    };

    const deleteSupplier = async (id) => {
        if (!(await window.customConfirm("Are you sure you want to delete this supplier?"))) return;
        const token = localStorage.getItem("token");
        if (token) {
            fetch(`http://localhost:5000/api/supplier/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        loadSuppliers();
                        alert("Supplier deleted successfully");
                    }
                })
                .catch(() => alert("Failed to delete supplier"));
        } else {
            navigate("/UserLogin", { replace: true });
        }
    };

    return (
        <div>
            <HeaderSuperAdmin />
            <div className="dashboard-layout">
                <SidebarSuperAdmin />
                <div className="content">
                    <h1>Suppliers</h1>
                    <button onClick={() => setIsCreateOpen(true)} className="create-btn">
                        Add Supplier
                    </button>

                    {isCreateOpen && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <h2>Add Supplier</h2>
                                <form onSubmit={createSupplier}>
                                    <div className="modal-field">
                                        <label>Supplier Name</label>
                                        <input
                                            type="text"
                                            value={createForm.Name}
                                            onChange={(e) => {
                                                const v = e.target.value.replace(/[^a-zA-Z ]/g, '');
                                                setCreateForm({ ...createForm, Name: v });
                                            }}
                                            maxLength={50}
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Supplier Phone</label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={createForm.phone_number}
                                            onChange={(e) => {
                                                const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
                                                setCreateForm({ ...createForm, phone_number: v });
                                            }}
                                            maxLength={11}
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Supplier Company</label>
                                        <input
                                            type="text"
                                            value={createForm.company}
                                            onChange={(e) => {
                                                const v = e.target.value.replace(/[^a-zA-Z ]/g, '');
                                                setCreateForm({ ...createForm, company: v });
                                            }}
                                            maxLength={80}
                                            required
                                        />
                                    </div>

                                    <div className="modal-actions">
                                        <button
                                            className="btn-cancel"
                                            type="button"
                                            onClick={() => setIsCreateOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button className="btn-primary" type="submit">
                                            Create
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {isEditOpen && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <h2>Edit Supplier</h2>
                                <form onSubmit={updateSupplier}>
                                    <div className="modal-field">
                                        <label>Supplier Name</label>
                                        <input
                                            type="text"
                                            value={editForm.Name}
                                            onChange={(e) => {
                                                const v = e.target.value.replace(/[^a-zA-Z ]/g, '');
                                                setEditForm({ ...editForm, Name: v });
                                            }}
                                            maxLength={50}
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Supplier Phone</label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={editForm.phone_number}
                                            onChange={(e) => {
                                                const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
                                                setEditForm({ ...editForm, phone_number: v });
                                            }}
                                            maxLength={11}
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Supplier Company</label>
                                        <input
                                            type="text"
                                            value={editForm.company}
                                            onChange={(e) => {
                                                const v = e.target.value.replace(/[^a-zA-Z ]/g, '');
                                                setEditForm({ ...editForm, company: v });
                                            }}
                                            maxLength={80}
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Supplier Status</label>
                                        <select
                                            value={editForm.status}
                                            onChange={(e) =>
                                                setEditForm({ ...editForm, status: e.target.value })
                                            }
                                            required
                                        >
                                            <option value="" disabled>
                                                Select Status
                                            </option>
                                            <option value="Pending">Pending</option>
                                            <option value="Confirm">Confirm</option>
                                            <option value="Cancel">Cancel</option>
                                        </select>
                                    </div>
                                    <div className="modal-actions">
                                        <button
                                            className="btn-cancel"
                                            type="button"
                                            onClick={() => setIsEditOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button className="btn-primary" type="submit">
                                            Update
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Supplier Name</th>
                                <th>Supplier Phone</th>
                                <th>Supplier Company</th>
                                <th>Supplier Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers.map((s) => (
                                <tr key={s._id}>
                                    <td>{s.Name}</td>
                                    <td>{s.phone_number}</td>
                                    <td>{s.company}</td>
                                    <td>{s.status}</td>
                                    <td>
                                        <button className="edit-button" onClick={() => openEdit(s)}>
                                            Edit
                                        </button>{" "}
                                        <button
                                            className="delete-button"
                                            onClick={() => deleteSupplier(s._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const SuperAdminDashboardRoles = () => {
    const [roles, setRoles] = useState([]);
    const navigate = useNavigate();
    const loadRoles = (token) => {
        fetch("http://localhost:5000/api/role", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setRoles(Array.isArray(data) ? data : []))
            .catch(() => { });
    };
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            loadRoles(token);
        } else {
            navigate("/UserLogin", { replace: true });
        }
    }, [navigate]);

    const handleDelete = async (roleId) => {
        if (!(await window.customConfirm("Are you sure you want to delete this role?"))) return;
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:5000/api/role/${roleId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Role deletion failed");
            alert(data.message || "Role deleted successfully!");
            loadRoles(token);
        } catch (error) {
            alert(error.message || "Role deletion failed");
        }
    };

    return (
        <div>
            <HeaderSuperAdmin />
            <div className="dashboard-layout">
                <SidebarSuperAdmin />
                <div className="content">
                    <h1>Roles</h1>
                    <table className="tablerole">
                        <thead>
                            <tr>
                                <th>Role Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map((r) => (
                                <tr key={r._id}>
                                    <td>{r.roleName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const SuperAdminDashboardOrders = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [createMode, setCreateMode] = useState(false);
    const [createForm, setCreateForm] = useState({
        supplier_id: "",
        product_id: "",
        quantity: "",
    });
    const navigate = useNavigate();

    const loadOrders = (token) => {
        fetch("http://localhost:5000/api/order", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setOrders(Array.isArray(data) ? data : []))
            .catch(() => { });
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            loadOrders(token);
            fetch("http://localhost:5000/api/product", {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => setProducts(Array.isArray(data) ? data : []))
                .catch(() => { });
            fetch("http://localhost:5000/api/supplier", {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => setSuppliers(Array.isArray(data) ? data : []))
                .catch(() => { });
        } else {
            navigate("/UserLogin", { replace: true });
        }
    }, [navigate]);

    const openCreate = () => {
        setCreateForm({ supplier_id: "", product_id: "", quantity: "" });
        setCreateMode(true);
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");

            const calcRes = await fetch(
                "http://localhost:5000/api/supplier/calculate-total",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        productId: createForm.product_id,
                        quantity: createForm.quantity,
                    }),
                },
            );
            const calcData = await calcRes.json();
            if (!calcRes.ok)
                throw new Error(calcData.message || "Failed to calculate subtotal");

            const payload = { ...createForm, subtotal: calcData.total };

            const res = await fetch("http://localhost:5000/api/order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Order creation failed");
            alert("Order created successfully!");
            setCreateMode(false);
            loadOrders(token);
        } catch (error) {
            alert(error.message || "Order creation failed");
        }
    };

    const handleConfirm = async (orderId) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:5000/api/order/confirmOrder`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ order_id: orderId, status: "Confirmed" }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Confirm failed");
            alert(data.message || "Order confirmed!");
            loadOrders(token);
        } catch (error) {
            alert(error.message || "Confirm failed");
        }
    };

    const handleCancel = async (orderId) => {
        if (!(await window.customConfirm("Are you sure you want to cancel this order?"))) return;
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:5000/api/order/confirmOrder`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ order_id: orderId, status: "Cancelled" }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Cancel failed");
            alert(data.message || "Order cancelled!");
            loadOrders(token);
        } catch (error) {
            alert(error.message || "Cancel failed");
        }
    };

    const getProductName = (id) => {
        const p = products.find((p) => p._id === id);
        return p ? p.product_name : id;
    };

    const getSupplierName = (id) => {
        const s = suppliers.find((s) => s._id === id);
        return s ? s.Name : id;
    };

    return (
        <div>
            <HeaderSuperAdmin />
            <div className="dashboard-layout">
                <SidebarSuperAdmin />
                <div className="content">
                    <h1>Orders</h1>
                    <button className="create-btn" onClick={openCreate}>
                        Create Order
                    </button>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Supplier</th>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Subtotal</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((o) => (
                                <tr key={o._id}>
                                    <td>{getSupplierName(o.supplier_id)}</td>
                                    <td>{getProductName(o.product_id)}</td>
                                    <td>{o.quantity}</td>
                                    <td>{o.subtotal || "-"}</td>
                                    <td>
                                        <span
                                            className={`status-badge status-${o.status?.toLowerCase()}`}
                                        >
                                            {o.status}
                                        </span>
                                    </td>
                                    <td>
                                        {o.status === "Pending" && (
                                            <>
                                                <button
                                                    className="edit-button"
                                                    onClick={() => handleConfirm(o._id)}
                                                >
                                                    Confirm
                                                </button>{" "}
                                                <button
                                                    className="delete-button"
                                                    onClick={() => handleCancel(o._id)}
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        )}
                                        {o.status !== "Pending" && <span>—</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {createMode && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Create Order</h2>
                        <form onSubmit={handleCreateSubmit}>
                            <div className="modal-field">
                                <label>Supplier</label>
                                <select
                                    value={createForm.supplier_id}
                                    onChange={(e) =>
                                        setCreateForm({
                                            ...createForm,
                                            supplier_id: e.target.value,
                                        })
                                    }
                                    required
                                >
                                    <option value="">Select Supplier</option>
                                    {suppliers.filter((s) => s.status === "Confirm").map((s) => (
                                        <option key={s._id} value={s._id}>
                                            {s.Name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-field">
                                <label>Product</label>
                                <select
                                    value={createForm.product_id}
                                    onChange={(e) =>
                                        setCreateForm({ ...createForm, product_id: e.target.value })
                                    }
                                    required
                                >
                                    <option value="">Select Product</option>
                                    {products.map((p) => (
                                        <option key={p._id} value={p._id}>
                                            {p.product_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-field">
                                <label>Quantity</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={createForm.quantity}
                                    onChange={(e) =>
                                        setCreateForm({ ...createForm, quantity: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="btn-primary">
                                    Create
                                </button>
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={() => setCreateMode(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const SuperAdminDashboardCheckout = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [cart, setCart] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [receipts, setReceipts] = useState([]);
    const [showReceipts, setShowReceipts] = useState(false);
    const [loading, setLoading] = useState(false);
    const [printReceipt, setPrintReceipt] = useState(null);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [reportType, setReportType] = useState("week");
    const [reportData, setReportData] = useState(null);
    const navigate = useNavigate();

    const loadProducts = (token) => {
        fetch("http://localhost:5000/api/product", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setProducts(Array.isArray(data) ? data : []))
            .catch(() => { });
    };

    const loadReceipts = (token) => {
        fetch("http://localhost:5000/api/receipt", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setReceipts(Array.isArray(data) ? data : []))
            .catch(() => { });
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            loadProducts(token);
            loadReceipts(token);
        } else {
            navigate("/UserLogin", { replace: true });
        }
    }, [navigate]);

    const addToCart = (product) => {
        if (product.status === "Sold Out" || product.Stock <= 0) {
            alert("This product is out of stock.");
            return;
        }
        const existing = cart.find((i) => i._id === product._id);
        if (existing) {
            if (existing.qty >= product.Stock) {
                alert("Cannot exceed available stock.");
                return;
            }
            setCart(
                cart.map((i) => (i._id === product._id ? { ...i, qty: i.qty + 1 } : i)),
            );
        } else {
            setCart([...cart, { ...product, qty: 1 }]);
        }
    };

    const updateQty = (_id, delta) => {
        setCart((prev) =>
            prev
                .map((i) => {
                    if (i._id !== _id) return i;
                    const newQty = i.qty + delta;
                    if (newQty <= 0) return null;
                    if (newQty > i.Stock) {
                        alert("Cannot exceed available stock.");
                        return i;
                    }
                    return { ...i, qty: newQty };
                })
                .filter(Boolean),
        );
    };

    const removeFromCart = (_id) => {
        setCart(cart.filter((i) => i._id !== _id));
    };

    const placeOrder = async () => {
        if (cart.length === 0) {
            alert("Cart is empty.");
            return;
        }
        const token = localStorage.getItem("token");
        const userRaw = localStorage.getItem("user");
        if (!token || !userRaw) {
            navigate("/UserLogin", { replace: true });
            return;
        }
        const user = JSON.parse(userRaw);

        setLoading(true);
        try {
            const items = cart.map(item => ({
                ProductDetail: item._id,
                quantity: item.qty
            }));

            const res = await fetch("http://localhost:5000/api/receipt", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    User: user._id,
                    items,
                    paymentMethod,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || data.message || "Receipt creation failed");
            }
            const receiptId = data._id;

            for (const item of cart) {
                await fetch("http://localhost:5000/api/product/stock/remove", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ product_id: item._id, quantity: item.qty }),
                });
            }

            alert("Order placed successfully! Receipt created.");
            setCart([]);
            loadProducts(token);
            loadReceipts(token);

            if (receiptId) {
                handlePrintReceipt(receiptId);
            }
        } catch (err) {
            alert(err.message || "Failed to place order.");
        } finally {
            setLoading(false);
        }
    };

    const handlePrintReceipt = async (receiptId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/UserLogin", { replace: true });
            return;
        }

        try {
            const res = await fetch(
                `http://localhost:5000/api/receipt/${receiptId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            if (!res.ok) throw new Error("Failed to fetch receipt");
            const data = await res.json();
            setPrintReceipt(data);
            setShowPrintModal(true);
        } catch (err) {
            alert("Failed to fetch receipt for printing");
        }
    };

    const fetchReport = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/UserLogin", { replace: true });
            return;
        }
        try {
            const res = await fetch(
                `http://localhost:5000/api/receipt/report?type=${reportType}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            const data = await res.json();
            if (!res.ok)
                throw new Error(
                    data.message || data.error || "Failed to generate report",
                );
            setReportData(data);
        } catch (err) {
            alert(err.message);
        }
    };

    const grandTotal = cart.reduce((sum, i) => sum + i.selling_price * i.qty, 0);

    return (
        <div>
            <HeaderSuperAdmin />
            <div className="dashboard-layout">
                <SidebarSuperAdmin />
                <div className="content">
                    <h1>Checkout / POS</h1>
                    <div className="checkout-search-container">
                        <input
                            type="text"
                            placeholder="Type product name to search and add to cart..."
                            className="modal-field checkout-search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery.trim() && (
                            <div className="search-autocomplete-dropdown">
                                {products
                                    .filter((p) =>
                                        (p.product_name || "")
                                            .toLowerCase()
                                            .includes(searchQuery.toLowerCase()),
                                    )
                                    .slice(0, 15)
                                    .map((p) => (
                                        <div
                                            key={p._id}
                                            onClick={() => {
                                                addToCart(p);
                                                setSearchQuery("");
                                            }}
                                            className="autocomplete-item"
                                        >
                                            <div className="autocomplete-item-name">
                                                {p.product_name}
                                            </div>
                                            <div
                                                className={`autocomplete-item-stock ${p.Stock > 0 && p.status !== "Sold Out" ? "stock-in" : "stock-out"}`}
                                            >
                                                {p.Stock > 0 && p.status !== "Sold Out"
                                                    ? `PKR ${p.selling_price} | Stock: ${p.Stock}`
                                                    : "Out of Stock"}
                                            </div>
                                        </div>
                                    ))}
                                {products.filter((p) =>
                                    (p.product_name || "")
                                        .toLowerCase()
                                        .includes(searchQuery.toLowerCase()),
                                ).length === 0 && (
                                        <div className="autocomplete-item autocomplete-item-empty">
                                            <div className="autocomplete-item-name autocomplete-empty-text">
                                                No products found.
                                            </div>
                                        </div>
                                    )}
                            </div>
                        )}
                    </div>

                    <h2>Cart</h2>
                    {cart.length === 0 ? (
                        <p className="empty-cart-msg">Cart is empty. Add products above.</p>
                    ) : (
                        <>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Unit Price</th>
                                        <th>Quantity</th>
                                        <th>Line Total</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.map((item) => (
                                        <tr key={item._id}>
                                            <td>{item.product_name}</td>
                                            <td>PKR {item.selling_price}</td>
                                            <td>
                                                <button
                                                    className="edit-button"
                                                    onClick={() => updateQty(item._id, -1)}
                                                >
                                                    −
                                                </button>{" "}
                                                {item.qty}{" "}
                                                <button
                                                    className="edit-button"
                                                    onClick={() => updateQty(item._id, 1)}
                                                >
                                                    +
                                                </button>
                                            </td>
                                            <td>PKR {(item.selling_price * item.qty).toFixed(2)}</td>
                                            <td>
                                                <button
                                                    className="delete-button"
                                                    onClick={() => removeFromCart(item._id)}
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="checkout-actions">
                                <h3>Grand Total: PKR {grandTotal.toFixed(2)}</h3>
                                <div className="modal-field inline-field">
                                    <label>Payment Method</label>
                                    <select
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    >
                                        <option value="Cash">Cash</option>
                                        <option value="Card">Card</option>
                                        <option value="Online Transfer">Online Transfer</option>
                                    </select>
                                </div>
                                <button
                                    className="create-btn"
                                    onClick={placeOrder}
                                    disabled={loading}
                                >
                                    {loading ? "Processing..." : "Place Order"}
                                </button>
                            </div>
                        </>
                    )}

                    <div className="receipt-history-section report-section">
                        <h2>Sales Report</h2>
                        <div className="report-controls">
                            <select
                                className="modal-field report-select"
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                            >
                                <option value="week">Past Week</option>
                                <option value="month">Past Month</option>
                                <option value="year">Past Year</option>
                            </select>
                            <button className="create-btn" onClick={fetchReport}>
                                Generate Report
                            </button>
                        </div>
                        {reportData && (
                            <div className="report-results">
                                <h3 className="report-results-title">
                                    {reportData.reportType.toUpperCase()} REPORT
                                </h3>
                                <p className="report-results-text">
                                    <strong>Total Receipts:</strong> {reportData.totalReceipts}
                                </p>
                                <p className="report-results-total">
                                    <strong>Total Sales:</strong> PKR {reportData.totalSales}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="receipt-history-section">
                        <button
                            className="edit-button"
                            onClick={() => setShowReceipts(!showReceipts)}
                        >
                            {showReceipts ? "Hide" : "Show"} Receipt History (
                            {receipts.length})
                        </button>
                        {showReceipts && (
                            <table className="table receipt-table">
                                <thead>
                                    <tr>
                                        <th>Receipt ID</th>
                                        <th>User</th>
                                        <th>Product</th>
                                        <th>Total (PKR)</th>
                                        <th>Payment Method</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {receipts.map((r) => (
                                        <tr key={r._id}>
                                            <td className="receipt-id-cell">#{r._id.slice(-6)}</td>
                                            <td>{r.User?.name || r.User}</td>
                                            <td>
                                                {r.items && r.items.length > 0 ? (
                                                    r.items.map((item, idx) => (
                                                        <div key={idx}>
                                                            {item.ProductDetail?.product_name || "Unknown Product"} x {item.quantity}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <>{r.ProductDetail?.product_name || "Unknown Product"} x {r.quantity || 0}</>
                                                )}
                                            </td>
                                            <td>PKR {r.total}</td>
                                            <td>{r.paymentMethod}</td>
                                            <td>
                                                <button
                                                    className="print-btn"
                                                    onClick={() => handlePrintReceipt(r._id)}
                                                >
                                                    Show Receipt
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {showPrintModal && printReceipt && printReceipt.receipt && (
                    <div className="modal-overlay">
                        <div className="modal print-modal">
                            <h2 className="print-modal-header">Receipt</h2>
                            <div className="print-modal-row">
                                <strong>Receipt ID:</strong> {printReceipt.receipt._id.slice(-8).toUpperCase()}
                            </div>
                            <div className="print-modal-row">
                                <strong>Payment Method:</strong>{" "}
                                {printReceipt.receipt.paymentMethod}
                            </div>
                            <div className="print-modal-row">
                                <strong>Products:</strong>
                                <ul className="print-modal-list">
                                    {printReceipt.receipt.items?.map((item, idx) => (
                                        <li key={idx} className="print-modal-list-item">
                                            {item.ProductDetail?.product_name || "Unknown"} x {item.quantity}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="print-modal-total">
                                <strong>Total:</strong> PKR {printReceipt.receipt.total}
                            </div>
                            <div className="print-modal-actions">
                                <button className="btn-primary" onClick={() => window.print()}>
                                    Print
                                </button>
                                <button
                                    className="btn-cancel"
                                    onClick={() => setShowPrintModal(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const SuperAdminDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState();
    const [counts, setCounts] = useState({ products: 0, users: 0, categories: 0, suppliers: 0, receipts: 0 });

    useEffect(() => {
        const stored = localStorage.getItem("user");
        setUser(JSON.parse(stored));
        if (!stored) {
            navigate("/UserLogin", { replace: true });
            return;
        }
        const token = localStorage.getItem("token");
        fetch("http://localhost:5000/api/dashboardstatus", {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
            .then(res => res.json())
            .then(data => setCounts(data))
            .catch(err => console.error("Failed to load dashboard status", err));
    }, [navigate]);

    const statCards = [
        {
            label: "Users",
            value: counts.users ?? 0,
            detail: "Registered users in the system",
        },
        {
            label: "Products",
            value: counts.products ?? 0,
            detail: "Total managed products",
        },
        {
            label: "Categories",
            value: counts.categories ?? 0,
            detail: "Product categories available",
        },
        {
            label: "Suppliers",
            value: counts.suppliers ?? 0,
            detail: "Total vendors",
        },
        {
            label: "Receipts",
            value: counts.receipts ?? 0,
            detail: "Total generated receipts",
        },
    ];

    return (
        <div>
            <HeaderSuperAdmin />
            <div className="dashboard-layout">
                <SidebarSuperAdmin />
                <div className="content">
                    <div className="dashboard-hero">
                        <div>
                            <p className="eyebrow">super admin dashboard</p>
                            <h1 className="welcome">Welcome {user?.name || "User"}</h1>
                            <p className="dashboard-subtitle">
                                A polished command center for cross-team inventory health,
                                permissions, and fast operational decisions.
                            </p>
                        </div>
                        <div className="status-chip">Control center</div>
                    </div>

                    <div className="dashboard-stat-grid">
                        {statCards.map((item) => (
                            <div className="stat-card" key={item.label}>
                                <div className="stat-card-label">{item.label}</div>
                                <div className="stat-card-value">{item.value}</div>
                                <div className="stat-card-detail">{item.detail}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export {
    SuperAdminDashboardCheckout,
    SuperAdminDashboardOrders,
    SuperAdminDashboardRoles,
    SuperAdminDashboardUsers,
    SuperAdminDashboardProducts,
    SuperAdminDashboardCategories,
    SuperAdminDashboardSuppliers,
    AdminDashboard,
    AdminDashboardCheckout,
    AdminDashboardOrders,
    UserDashboard,
    SuperAdminDashboard,
    AdminDashboardProducts,
    AdminDashboardCategories,
    AdminDashboardSuppliers,
};