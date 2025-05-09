import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../context/Cart";
import './Cart.css'
import emptyBasket from '../../assets/empty-basket.png'
import CartBalance from "./CartBalance";
import CartCardDisplay from "./CartCardDisplay";
import CartTableDisplay from "./CartTableDisplay";
import { useWindowSize } from "../../hooks/useWindowSize";

const Cart = () => {
    const {cartItems} = useContext(CartContext)
    
    const windowSize = useWindowSize();
  
    if(cartItems.length == 0)
        return <div className="empty-cart-items-container">
            <h2 style={{color: "var(--main-color)"}}>YOUR BASKET IS EMPTY!</h2>
            <img id="emptyBasketImg" src={emptyBasket} alt="emptyBasket" />
        </div>

    return <div className="cart-items-container">


        
        <div className="cart-display-container">
            
            {
                windowSize < 800 ?
                <CartCardDisplay />
                :
                <CartTableDisplay />
            }
        </div>

        <div className="card-balance-container">
            <CartBalance />
        </div>
            
        
    </div>
}

export default Cart;