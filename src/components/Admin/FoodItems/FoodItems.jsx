import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import CardDisplay from "./CardDisplay";
import TableDisplay from "./TableDisplay";

import './FoodItems.css'
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import { BACKEND_URL } from "../../../constants/Constants";
import { GlobalStateContext } from "../../../context/GlobalState";
import { MenuContext } from "../../../context/Menu";
import { useWindowSize } from "../../../hooks/useWindowSize";


const FoodItems = () => {
  const navigate = useNavigate();
  const [menu, setMenu] = useState({ foodItems: [], categories: [], paginationData: null });
  const [searchBarVal, setSearchBarVal] = useState("")
  const [selectedPageSize, setSelectedPageSize] = useState(window.innerWidth < 800 ? 1000 : 5)
  const windowSize = useWindowSize();

  const {clearUserCookie, setActiveNavbarItem} = useContext(GlobalStateContext);
  const {clearMenuItemsState} = useContext(MenuContext)

  useEffect(() => {
    setActiveNavbarItem("FOOD ITEMS")

    loadData();
  }, []);

  const loadData = (pageNumber=0, pageSize=selectedPageSize, searchVal="") => {
    axios.get(`${BACKEND_URL}/api/v1/app/admin/food-items?page_number=${pageNumber}&page_size=${pageSize}&search_val=${searchVal}`, 
                {headers: { Authorization: `Bearer ${Cookies.get("token")}` }})   
    .then((res) => {
      if (res.status == 200) {
        setMenu({
          foodItems: res.data.message.content,
          paginationData: {number: res.data.message.number, 
            empty: res.data.message.empty, 
            first: res.data.message.first, 
            last: res.data.message.last, 
            numberOfElements: res.data.message.numberOfElements, 
            size: res.data.message.size, 
            totalElements: res.data.message.totalElements, 
            totalPages: res.data.message.totalPages}
        });
      }
    })
    .catch((err) => {
      if (err.status == 401 || err.status == 403) {
        clearUserCookie();
        clearMenuItemsState();
        navigate("/biteandsip/login");
      }
    });
  }

  const handleSearchBarChange = () => {
    setSearchBarVal(event.target.value)
    loadData(0, selectedPageSize, event.target.value)
  }

  const loadPage = (pageNum, pageSize) => {
    loadData(pageNum, pageSize, searchBarVal)
  }

  const updateSelectedPageSize = (pageSize) => {
    setSelectedPageSize(pageSize)
  }

  const addNewFoodItem = () => {
    navigate(`/biteandsip/admin/food-items/new`);
  };

  const updateFoodItems = (draggedItem, draggedOverItem) => {

    axios.post(`${BACKEND_URL}/api/v1/app/admin/food-items/update-order`,
      { draggedItemIndex: draggedItem, draggedOverItemIndex: draggedOverItem, pageNumber: menu.paginationData.number, pageSize: menu.paginationData.size},
      { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
    )
    .then((res) => {
      if (res.status == 200) {
        setMenu({
          foodItems: res.data.message.content,
          paginationData: {number: res.data.message.number, 
            empty: res.data.message.empty, 
            first: res.data.message.first, 
            last: res.data.message.last, 
            numberOfElements: res.data.message.numberOfElements, 
            size: res.data.message.size, 
            totalElements: res.data.message.totalElements, 
            totalPages: res.data.message.totalPages}
        });
      }
    })
    .catch((err) => {
      if(err.status == 401 || err.status == 403){
        clearUserCookie();
        clearMenuItemsState();
        navigate("/biteandsip/login");
    }
    });
  }

  return (
    <div className="main-container">
      <Breadcrumbs />

      <div className="main-actions-container">
        <div className="search-field-container">
          <input
            type="text"
            placeholder="Search Food Items"
            id="searchBarVal"
            name="searchBarVal"
            className="search-input"
            onChange={handleSearchBarChange}
          />
        </div>

        <button onClick={addNewFoodItem} className="add-action-container">
          <span className="material-symbols-rounded">add</span>
        </button>
      </div>

      {
          windowSize < 800 ? (
              <CardDisplay
                foodItems={menu.foodItems}
                foodCategories={menu.categories}
              />
            ) : (
            menu.paginationData != null && <TableDisplay
              foodItems={menu.foodItems}
              updateFoodItems = {updateFoodItems}
              foodCategories={menu.categories}
              paginationData={menu.paginationData}
              loadPage={loadPage}
              updateSelectedPageSize={updateSelectedPageSize}
            />
          )
      }
    </div>
  );
};

export default FoodItems;
