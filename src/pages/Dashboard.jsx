import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import HeaderSuperAdmin from "../Components/HeaderSuperAdmin";
import SidebarSuperAdmin from "../Components/SidebarSuperAdmin";
import HeaderAdmin from "../Components/HeaderAdmin";
import SidebarAdmin from "../Components/SidebarAdmin";
import HeaderUser from "../Components/HeaderUser";
import SidebarUser from "../Components/SidebarUser";

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

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (!stored) {
            navigate("/UserLogin", { replace: true });
        }
    }, [navigate]);

    const statCards = [
        {
            label: "Orders",
            value: "Track",
            detail: "Monitor status and next actions",
        },
        {
            label: "Products",
            value: "Manage",
            detail: "Keep pricing and stock up to date",
        },
        {
            label: "Suppliers",
            value: "Review",
            detail: "Stay close to your vendors",
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
        if (!confirm("Are you sure you want to cancel this order?")) return;
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
                                    {suppliers.map((s) => (
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
    const handleDelete = (productId) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
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
                    <h1>Products</h1>
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
                                            onChange={(e) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    product_name: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Description</label>
                                        <input
                                            type="text"
                                            value={createForm.product_description}
                                            onChange={(e) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    product_description: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Purchase Price</label>
                                        <input
                                            type="text"
                                            value={createForm.product_purchase_price}
                                            onChange={(e) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    product_purchase_price: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Selling Price</label>
                                        <input
                                            type="text"
                                            value={createForm.product_selling_price}
                                            onChange={(e) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    product_selling_price: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Stock</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={createForm.product_stock}
                                            onChange={(e) => {
                                                const stock = e.target.value;
                                                setCreateForm({
                                                    ...createForm,
                                                    product_stock: stock,
                                                    product_status:
                                                        Number(stock) > 0 ? "InStock" : "Sold Out",
                                                });
                                            }}
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
                                            {suppliers.map((s) => (
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
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    product_name: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Description</label>
                                        <input
                                            type="text"
                                            value={editForm.product_description}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    product_description: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Purchase Price</label>
                                        <input
                                            type="text"
                                            value={editForm.product_purchase_price}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    product_purchase_price: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Selling Price</label>
                                        <input
                                            type="text"
                                            value={editForm.product_selling_price}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    product_selling_price: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Stock</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={editForm.product_stock}
                                            onChange={(e) => {
                                                const stock = e.target.value;
                                                setEditForm({
                                                    ...editForm,
                                                    product_stock: stock,
                                                    product_status:
                                                        Number(stock) > 0 ? "InStock" : "Sold Out",
                                                });
                                            }}
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
                                            {suppliers.map((s) => (
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
                                <img
                                    className="product-card-img"
                                    src={p.image}
                                    alt={p.product_name}
                                />
                                <h3 className="product-card-title">{p.product_name}</h3>
                                <p className="product-card-price">{p.product_description}</p>
                                <p className="product-card-price">PKR {p.selling_price}</p>
                                <p className="product-card-stock">Stock: {p.Stock}</p>
                                <p className="product-card-stock">
                                    Category: {p.category?.category_name || p.category}
                                </p>
                                <p className="product-card-stock">
                                    Supplier: {p.supplier?.Name || p.supplier}
                                </p>
                                <p className="product-card-stock">Status: {p.status}</p>
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

    const handleDelete = (id) => {
        if (!confirm("Are you sure you want to delete this category?")) return;
        const token = localStorage.getItem("token");
        if (token) {
            fetch(`http://localhost:5000/api/category/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then(() => {
                    setCategories(categories.filter((c) => c._id !== id));
                    alert("Category deleted successfully");
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
                                            onChange={(e) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    category_name: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Description</label>
                                        <input
                                            type="text"
                                            value={createForm.description}
                                            onChange={(e) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    description: e.target.value,
                                                })
                                            }
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
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    category_name: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Description</label>
                                        <input
                                            type="text"
                                            value={editForm.description}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    description: e.target.value,
                                                })
                                            }
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
        if (!confirm("Are you sure you want to delete this supplier?")) return;
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
                                            onChange={(e) =>
                                                setCreateForm({ ...createForm, Name: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Supplier Phone</label>
                                        <input
                                            type="text"
                                            value={createForm.phone_number}
                                            onChange={(e) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    phone_number: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Supplier Company</label>
                                        <input
                                            type="text"
                                            value={createForm.company}
                                            onChange={(e) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    company: e.target.value,
                                                })
                                            }
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
                                            onChange={(e) =>
                                                setEditForm({ ...editForm, Name: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Supplier Phone</label>
                                        <input
                                            type="text"
                                            value={editForm.phone_number}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    phone_number: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Supplier Company</label>
                                        <input
                                            type="text"
                                            value={editForm.company}
                                            onChange={(e) =>
                                                setEditForm({ ...editForm, company: e.target.value })
                                            }
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
            let lastReceiptId = null;
            for (const item of cart) {
                const calcRes = await fetch(
                    "http://localhost:5000/api/receipt/calculate-total",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ productId: item._id, quantity: item.qty }),
                    },
                );
                const calcData = await calcRes.json();
                if (!calcRes.ok)
                    throw new Error(calcData.message || "Failed to calculate total");

                const lineTotal = calcData.total;

                const res = await fetch("http://localhost:5000/api/receipt", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        User: user._id,
                        ProductDetail: item._id,
                        quantity: item.qty,
                        total: lineTotal,
                        paymentMethod,
                    }),
                });
                const data = await res.json();
                if (!res.ok)
                    throw new Error(
                        data.error || data.message || "Receipt creation failed",
                    );
                lastReceiptId = data._id;

                await fetch("http://localhost:5000/api/product/stock/remove", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ product_id: item._id, quantity: item.qty }),
                });
            }

            alert("Order placed successfully! Receipts created.");
            setCart([]);
            loadProducts(token);
            loadReceipts(token);

            if (lastReceiptId) {
                handlePrintReceipt(lastReceiptId);
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
                                                {r.ProductDetail?.product_name || r.ProductDetail} x{" "}
                                                {r.quantity}
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
                                <strong>Receipt ID:</strong> {printReceipt.receipt._id}
                            </div>
                            <div className="print-modal-row">
                                <strong>Payment Method:</strong>{" "}
                                {printReceipt.receipt.paymentMethod}
                            </div>
                            <div className="print-modal-row">
                                <strong>Product:</strong>{" "}
                                {printReceipt.receipt.ProductDetail?.product_name || "Unknown"}{" "}
                                x {printReceipt.receipt.quantity}
                            </div>
                            <div className="print-modal-total">
                                <strong>Total:</strong> PKR {printReceipt.receipt.total}
                            </div>
                            <div className="print-modal-actions">
                                <button className="create-btn" onClick={() => window.print()}>
                                    Print
                                </button>
                                <button
                                    className="delete-button"
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

    const saveEdit = () => {
        const token = localStorage.getItem("token");
        fetch(`http://localhost:5000/api/user/${editingUser._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(editForm),
        })
            .then((res) => res.json())
            .then((updated) => {
                setUsers(
                    users.map((u) => (u._id === updated._id ? { ...u, ...updated } : u)),
                );
                setEditingUser(null);
            })
            .catch(() => { });
    };

    const DeleteUser = (userId) => {
        if (confirm("Are you sure you want to delete this user?")) {
            const token = localStorage.getItem("token");
            fetch(`http://localhost:5000/api/user/${userId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(() => setUsers(users.filter((u) => u._id !== userId)))
                .catch(() => { });
        }
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
                                onChange={(e) =>
                                    setEditForm({ ...editForm, name: e.target.value })
                                }
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
                                    onChange={(e) =>
                                        setCreateForm({ ...createForm, name: e.target.value })
                                    }
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
                                <input
                                    type="password"
                                    value={createForm.password}
                                    onChange={(e) =>
                                        setCreateForm({ ...createForm, password: e.target.value })
                                    }
                                    required
                                />
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
    const handleDelete = (productId) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
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
                    <h1>Products</h1>
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
                                            onChange={(e) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    product_name: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Description</label>
                                        <input
                                            type="text"
                                            value={createForm.product_description}
                                            onChange={(e) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    product_description: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Purchase Price</label>
                                        <input
                                            type="text"
                                            value={createForm.product_purchase_price}
                                            onChange={(e) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    product_purchase_price: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Selling Price</label>
                                        <input
                                            type="text"
                                            value={createForm.product_selling_price}
                                            onChange={(e) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    product_selling_price: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Stock</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={createForm.product_stock}
                                            onChange={(e) => {
                                                const stock = e.target.value;
                                                setCreateForm({
                                                    ...createForm,
                                                    product_stock: stock,
                                                    product_status:
                                                        Number(stock) > 0 ? "InStock" : "Sold Out",
                                                });
                                            }}
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
                                            {suppliers.map((s) => (
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
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    product_name: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Description</label>
                                        <input
                                            type="text"
                                            value={editForm.product_description}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    product_description: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Purchase Price</label>
                                        <input
                                            type="text"
                                            value={editForm.product_purchase_price}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    product_purchase_price: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Selling Price</label>
                                        <input
                                            type="text"
                                            value={editForm.product_selling_price}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    product_selling_price: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Product Stock</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={editForm.product_stock}
                                            onChange={(e) => {
                                                const stock = e.target.value;
                                                setEditForm({
                                                    ...editForm,
                                                    product_stock: stock,
                                                    product_status:
                                                        Number(stock) > 0 ? "InStock" : "Sold Out",
                                                });
                                            }}
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
                                            {suppliers.map((s) => (
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
                                <img
                                    className="product-card-img"
                                    src={p.image}
                                    alt={p.product_name}
                                />
                                <h3 className="product-card-title">{p.product_name}</h3>
                                <p className="product-card-price">{p.product_description}</p>
                                <p className="product-card-price">PKR {p.selling_price}</p>
                                <p className="product-card-stock">Stock: {p.Stock}</p>
                                <p className="product-card-stock">
                                    Category: {p.category?.category_name || p.category}
                                </p>
                                <p className="product-card-stock">
                                    Supplier: {p.supplier?.Name || p.supplier}
                                </p>
                                <p className="product-card-stock">Status: {p.status}</p>
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

    const handleDelete = (id) => {
        if (!confirm("Are you sure you want to delete this category?")) return;
        const token = localStorage.getItem("token");
        if (token) {
            fetch(`http://localhost:5000/api/category/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then(() => {
                    setCategories(categories.filter((c) => c._id !== id));
                    alert("Category deleted successfully");
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
                                            onChange={(e) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    category_name: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Description</label>
                                        <input
                                            type="text"
                                            value={createForm.description}
                                            onChange={(e) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    description: e.target.value,
                                                })
                                            }
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
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    category_name: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Description</label>
                                        <input
                                            type="text"
                                            value={editForm.description}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    description: e.target.value,
                                                })
                                            }
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
        if (!confirm("Are you sure you want to delete this supplier?")) return;
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
                                            onChange={(e) =>
                                                setCreateForm({ ...createForm, Name: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Supplier Phone</label>
                                        <input
                                            type="text"
                                            value={createForm.phone_number}
                                            onChange={(e) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    phone_number: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Supplier Company</label>
                                        <input
                                            type="text"
                                            value={createForm.company}
                                            onChange={(e) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    company: e.target.value,
                                                })
                                            }
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
                                            onChange={(e) =>
                                                setEditForm({ ...editForm, Name: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Supplier Phone</label>
                                        <input
                                            type="text"
                                            value={editForm.phone_number}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    phone_number: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Supplier Company</label>
                                        <input
                                            type="text"
                                            value={editForm.company}
                                            onChange={(e) =>
                                                setEditForm({ ...editForm, company: e.target.value })
                                            }
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
    const [isEditing, setIsEditing] = useState(false);
    const [currentRole, setCurrentRole] = useState(null);
    const [editForm, setEditForm] = useState({
        name: "",
    });
    const [createForm, setCreateForm] = useState({
        name: "",
    });
    const [isCreateOpen, setIsCreateOpen] = useState(false);
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

    const openEdit = (role) => {
        setIsEditing(true);
        setCurrentRole(role._id);
        setEditForm({
            name: role.roleName,
        });
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setCurrentRole(null);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5000/api/role/${currentRole}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    roleName: editForm.name,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Role update failed");
            alert("Role updated successfully!");
            setIsEditing(false);
            setCurrentRole(null);
            loadRoles(token);
        } catch (error) {
            alert(error.message || "Role update failed");
        }
    };

    const handleDelete = async (roleId) => {
        if (!confirm("Are you sure you want to delete this role?")) return;
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

    const openCreate = () => {
        setIsCreateOpen(true);
        setCreateForm({ name: "" });
    };

    const cancelCreate = () => {
        setIsCreateOpen(false);
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/api/role", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    roleName: createForm.name,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Role creation failed");
            alert("Role created successfully!");
            setCreateForm({
                name: "",
            });
            setIsCreateOpen(false);
            loadRoles(token);
        } catch (error) {
            alert(error.message || "Role creation failed");
        }
    };

    return (
        <div>
            <HeaderSuperAdmin />
            <div className="dashboard-layout">
                <SidebarSuperAdmin />
                <div className="content">
                    <h1>Roles</h1>
                    <button className="create-btn" onClick={openCreate}>
                        Create Role
                    </button>
                    <table className="tablerole">
                        <thead>
                            <tr>
                                <th>Role Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map((r) => (
                                <tr key={r._id}>
                                    <td>{r.roleName}</td>
                                    <td>
                                        <button className="edit-button" onClick={() => openEdit(r)}>
                                            Edit
                                        </button>{" "}
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDelete(r._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* create modal */}
                    {isCreateOpen && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <h2>Create Role</h2>
                                <form onSubmit={handleCreateSubmit}>
                                    <div className="modal-field">
                                        <label>Role Name</label>
                                        <input
                                            type="text"
                                            value={createForm.name}
                                            onChange={(e) =>
                                                setCreateForm({ ...createForm, name: e.target.value })
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="modal-actions">
                                        <button className="btn-cancel" onClick={cancelCreate}>
                                            Cancel
                                        </button>
                                        <button className="btn-primary" type="submit">
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* edit modal */}
                    {isEditing && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <h2>Edit Role</h2>
                                <form onSubmit={handleEditSubmit}>
                                    <div className="modal-field">
                                        <label>Role Name</label>
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) =>
                                                setEditForm({ ...editForm, name: e.target.value })
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="modal-actions">
                                        <button className="btn-cancel" onClick={cancelEdit}>
                                            Cancel
                                        </button>
                                        <button className="btn-primary" type="submit">
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
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
        if (!confirm("Are you sure you want to cancel this order?")) return;
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
                                    {suppliers.map((s) => (
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
            let lastReceiptId = null;
            for (const item of cart) {
                const calcRes = await fetch(
                    "http://localhost:5000/api/receipt/calculate-total",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ productId: item._id, quantity: item.qty }),
                    },
                );
                const calcData = await calcRes.json();
                if (!calcRes.ok)
                    throw new Error(calcData.message || "Failed to calculate total");

                const lineTotal = calcData.total;

                const res = await fetch("http://localhost:5000/api/receipt", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        User: user._id,
                        ProductDetail: item._id,
                        quantity: item.qty,
                        total: lineTotal,
                        paymentMethod,
                    }),
                });
                const data = await res.json();
                if (!res.ok)
                    throw new Error(
                        data.error || data.message || "Receipt creation failed",
                    );
                lastReceiptId = data._id;

                await fetch("http://localhost:5000/api/product/stock/remove", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ product_id: item._id, quantity: item.qty }),
                });
            }

            alert("Order placed successfully! Receipts created.");
            setCart([]);
            loadProducts(token);
            loadReceipts(token);

            if (lastReceiptId) {
                handlePrintReceipt(lastReceiptId);
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
                                                {r.ProductDetail?.product_name || r.ProductDetail} x{" "}
                                                {r.quantity}
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
                                <strong>Receipt ID:</strong> {printReceipt.receipt._id}
                            </div>
                            <div className="print-modal-row">
                                <strong>Payment Method:</strong>{" "}
                                {printReceipt.receipt.paymentMethod}
                            </div>
                            <div className="print-modal-row">
                                <strong>Product:</strong>{" "}
                                {printReceipt.receipt.ProductDetail?.product_name || "Unknown"}{" "}
                                x {printReceipt.receipt.quantity}
                            </div>
                            <div className="print-modal-total">
                                <strong>Total:</strong> PKR {printReceipt.receipt.total}
                            </div>
                            <div className="print-modal-actions">
                                <button className="create-btn" onClick={() => window.print()}>
                                    Print
                                </button>
                                <button
                                    className="delete-button"
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

    const statCards = [
        {
            label: "Users",
            value: "Control",
            detail: "Handle user roles and access",
        },
        {
            label: "Products",
            value: "Monitor",
            detail: "Keep inventory quality in sight",
        },
        {
            label: "Categories",
            value: "Organize",
            detail: "Structure your catalog cleanly",
        },
        {
            label: "Suppliers",
            value: "Review",
            detail: "Track important vendor relationships",
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