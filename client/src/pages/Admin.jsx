import React, {
  useState,
  useEffect,
  useCallback,
} from "react";

import { useNavigate } from "react-router-dom";

import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";

import DashboardCards from "../components/admin/DashboardCards";
import OrdersTable from "../components/admin/OrdersTable";
import ProductsTable from "../components/admin/ProductsTable";
import CustomersTable from "../components/admin/CustomersTable";

import AnalyticsSection from "../components/admin/Analytics";
import SettingsSection from "../components/admin/Settings";

import ProductFormModal from "../components/admin/ProductFormModal";

import adminApi from "../utils/adminApi";



export default function Admin() {


  const navigate = useNavigate();



  // ==========================
  // STATES
  // ==========================


  const [activeTab,setActiveTab] = useState("dashboard");

  const [sidebarOpen,setSidebarOpen] = useState(false);


  const [adminInfo,setAdminInfo] = useState(null);


  const [stats,setStats] = useState(null);

  const [orders,setOrders] = useState([]);

  const [products,setProducts] = useState([]);

  const [customers,setCustomers] = useState([]);


  const [analytics,setAnalytics] = useState(null);

  const [settings,setSettings] = useState(null);



  const [loading,setLoading] = useState(true);

  const [error,setError] = useState("");



  // Product Modal

  const [showProductModal,setShowProductModal] = useState(false);

  const [editingProduct,setEditingProduct] = useState(null);





  // ==========================
  // LOAD ADMIN INFO
  // ==========================


  useEffect(()=>{


    const info =
      localStorage.getItem("adminInfo");


    if(info){

      setAdminInfo(
        JSON.parse(info)
      );

    }


  },[]);







  // ==========================
  // LOAD DASHBOARD
  // ==========================


  const loadDashboard = useCallback(async()=>{


    try{


      setLoading(true);

      setError("");



      const [
        statsRes,
        ordersRes
      ] = await Promise.all([


        adminApi.get(
          "/dashboard-stats"
        ),


        adminApi.get(
          "/orders"
        )


      ]);



      setStats(
        statsRes.data.stats
      );


      setOrders(
        ordersRes.data.orders
      );



    }
    catch(err){


      setError(
        err.response?.data?.message ||
        "Failed loading dashboard"
      );


    }
    finally{

      setLoading(false);

    }


  },[]);







  // ==========================
  // LOAD PRODUCTS
  // ==========================


  const loadProducts = useCallback(async()=>{


    try{


      setLoading(true);

      setError("");



      const {data}=await adminApi.get(
        "/products"
      );


      setProducts(
        data.products
      );


    }
    catch(err){


      setError(
        err.response?.data?.message ||
        "Failed loading products"
      );


    }
    finally{

      setLoading(false);

    }


  },[]);







  // ==========================
  // LOAD CUSTOMERS
  // ==========================


  const loadCustomers = useCallback(async()=>{


    try{


      setLoading(true);


      const {data}=await adminApi.get(
        "/customers"
      );


      setCustomers(
        data.customers
      );


    }
    catch(err){


      setError(
        err.response?.data?.message ||
        "Failed loading customers"
      );


    }
    finally{

      setLoading(false);

    }


  },[]);




// ==========================
// PART 2 CONTINUES BELOW
// ==========================
  // ==========================
  // LOAD ANALYTICS
  // ==========================


  const loadAnalytics = useCallback(async()=>{


    try{


      setLoading(true);


      const {data}=await adminApi.get(
        "/analytics"
      );


      setAnalytics(
        data.analytics
      );


    }
    catch(err){


      setError(
        err.response?.data?.message ||
        "Failed loading analytics"
      );


    }
    finally{

      setLoading(false);

    }


  },[]);






  // ==========================
  // LOAD SETTINGS
  // ==========================


  const loadSettings = useCallback(async()=>{


    try{


      setLoading(true);


      const {data}=await adminApi.get(
        "/settings"
      );


      setSettings(
        data.settings
      );


    }
    catch(err){


      setError(
        err.response?.data?.message ||
        "Failed loading settings"
      );


    }
    finally{

      setLoading(false);

    }


  },[]);







  // ==========================
  // TAB CHANGE LISTENER
  // ==========================


  useEffect(()=>{


    if(activeTab==="dashboard")
      loadDashboard();


    if(activeTab==="orders")
      loadDashboard();


    if(activeTab==="cancelled")
      loadDashboard();


    if(activeTab==="products")
      loadProducts();


    if(activeTab==="customers")
      loadCustomers();


    if(activeTab==="analytics")
      loadAnalytics();


    if(activeTab==="settings")
      loadSettings();



  },[
    activeTab,
    loadDashboard,
    loadProducts,
    loadCustomers,
    loadAnalytics,
    loadSettings
  ]);








  // ==========================
  // LOGOUT
  // ==========================


  const handleLogout=()=>{


    localStorage.removeItem(
      "adminToken"
    );


    localStorage.removeItem(
      "adminInfo"
    );


    navigate(
      "/admin-login",
      {
        replace:true
      }
    );


  };







  // ==========================
  // ORDER ACTIONS
  // ==========================


  const handleApproveOrder=async(orderId)=>{


    try{


      await adminApi.patch(
        `/orders/${orderId}/approve`
      );



      setOrders(prev=>

        prev.map(order=>

          order._id===orderId

          ?

          {
            ...order,
            status:"Approved"
          }

          :

          order

        )

      );


    }
    catch(err){


      setError(
        err.response?.data?.message ||
        "Approve failed"
      );


    }


  };






  const handleRejectOrder=async(orderId)=>{


    try{


      await adminApi.patch(
        `/orders/${orderId}/reject`
      );



      setOrders(prev=>

        prev.map(order=>

          order._id===orderId

          ?

          {
            ...order,
            status:"Rejected"
          }

          :

          order

        )

      );


    }
    catch(err){


      setError(
        err.response?.data?.message ||
        "Reject failed"
      );


    }


  };









  // ==========================
  // PRODUCT MODAL OPEN
  // ==========================


  const handleAddProduct=()=>{


    setEditingProduct(null);


    setShowProductModal(true);


  };






  const handleEditProduct=(product)=>{


    setEditingProduct(product);


    setShowProductModal(true);


  };








  // ==========================
  // SAVE PRODUCT WITH IMAGES
  // ==========================


  const handleSaveProduct=async(formData)=>{


    try{


      setLoading(true);



      let response;



      if(editingProduct){


        response = await adminApi.put(

          `/products/${editingProduct._id}`,

          formData,

          {

            headers:{

              "Content-Type":
              "multipart/form-data"

            }

          }

        );


        setProducts(prev=>

          prev.map(product=>

            product._id===editingProduct._id

            ?

            response.data.product

            :

            product

          )

        );


      }

      else{


        response = await adminApi.post(

          "/products",

          formData,

          {

            headers:{

              "Content-Type":
              "multipart/form-data"

            }

          }

        );



        setProducts(prev=>[

          response.data.product,

          ...prev

        ]);

      }



      setShowProductModal(false);

      setEditingProduct(null);



    }
    catch(err){


      setError(
        err.response?.data?.message ||
        "Product save failed"
      );


    }
    finally{

      setLoading(false);

    }


  };






  // ==========================
  // DELETE PRODUCT
  // ==========================


  const handleDeleteProduct=async(id)=>{


    if(
      !window.confirm(
        "Delete this product?"
      )
    )
    return;



    try{


      await adminApi.delete(
        `/products/${id}`
      );


      setProducts(prev=>

        prev.filter(
          product=>
          product._id!==id
        )

      );


    }
    catch(err){


      setError(
        err.response?.data?.message ||
        "Delete failed"
      );


    }


  };




// ==========================
// PART 3 CONTINUES BELOW
// ==========================
  // ==========================
  // SAVE SETTINGS
  // ==========================


  const handleSaveSettings = async(form)=>{


    try{


      const {data}=await adminApi.put(
        "/settings",
        form
      );


      setSettings(
        data.settings
      );


    }
    catch(err){


      setError(
        err.response?.data?.message ||
        "Settings save failed"
      );


    }


  };






  // ==========================
  // ORDER LISTS SPLIT BY STATUS
  // Cancelled orders are kept out of the main Dashboard/Orders views and
  // shown in their own "Cancelled Orders" tab instead of being deleted
  // from the database.
  // ==========================

  const activeOrders = orders.filter(
    (order) => order.status !== "Cancelled"
  );

  const cancelledOrders = orders.filter(
    (order) => order.status === "Cancelled"
  );


  // ==========================
  // RETURN UI
  // ==========================


  return (

    <div className="min-h-screen bg-stone-50 flex">


      {/* SIDEBAR */}

      <Sidebar

        activeTab={activeTab}

        setActiveTab={setActiveTab}

        isOpen={sidebarOpen}

        onClose={()=>
          setSidebarOpen(false)
        }

        onLogout={handleLogout}

      />





      <div className="flex-1 min-w-0 flex flex-col">



        {/* HEADER */}

        <Header

          activeTab={activeTab}

          onMenuClick={()=>
            setSidebarOpen(true)
          }

          adminName={
            adminInfo?.name
          }

        />





        <main className="flex-1 px-6 lg:px-10 py-8 space-y-8">



          {/* ERROR MESSAGE */}

          {
            error && (

              <p className="
                text-xs
                tracking-wide
                text-red-600
                bg-red-50
                border
                border-red-100
                px-4
                py-3
                rounded-xl
              ">

                {error}

              </p>

            )
          }





          {/* LOADING */}

          {
            loading && (

              <p className="
                text-xs
                uppercase
                tracking-[0.25em]
                text-stone-400
              ">

                Loading...

              </p>

            )
          }







          {/* DASHBOARD */}

          {
            !loading &&
            activeTab==="dashboard" && (

              <>


                <DashboardCards
                  stats={stats}
                />



                <OrdersTable

                  orders={activeOrders}

                  onApprove={
                    handleApproveOrder
                  }

                  onReject={
                    handleRejectOrder
                  }

                />


              </>

            )
          }








          {/* ORDERS */}

          {
            !loading &&
            activeTab==="orders" && (


              <OrdersTable

                orders={activeOrders}

                onApprove={
                  handleApproveOrder
                }

                onReject={
                  handleRejectOrder
                }

              />


            )
          }




          {/* CANCELLED ORDERS */}

          {
            !loading &&
            activeTab==="cancelled" && (


              <OrdersTable

                orders={cancelledOrders}

                onApprove={
                  handleApproveOrder
                }

                onReject={
                  handleRejectOrder
                }

              />


            )
          }









          {/* PRODUCTS */}

          {
            !loading &&
            activeTab==="products" && (


              <ProductsTable


                products={products}



                onAdd={
                  handleAddProduct
                }



                onEdit={
                  handleEditProduct
                }



                onDelete={
                  handleDeleteProduct
                }


              />


            )
          }








          {/* CUSTOMERS */}

          {
            !loading &&
            activeTab==="customers" && (


              <CustomersTable

                customers={customers}

              />


            )
          }









          {/* ANALYTICS */}

          {
            !loading &&
            activeTab==="analytics" && (


              <AnalyticsSection

                analytics={analytics}

              />


            )
          }









          {/* SETTINGS */}

          {
            !loading &&
            activeTab==="settings" && (


              <SettingsSection

                settings={settings}

                onSave={
                  handleSaveSettings
                }

              />


            )
          }





        </main>



      </div>








      {/* PRODUCT ADD / EDIT MODAL */}

      {
        showProductModal && (


          <ProductFormModal


            open={showProductModal}


            product={editingProduct}



            onClose={()=>{


              setShowProductModal(false);


              setEditingProduct(null);


            }}



            onSave={
              handleSaveProduct
            }


          />


        )
      }






    </div>

  );

}







// =========================
// END OF PART 2
// Paste PART 3 below this line
// =========================