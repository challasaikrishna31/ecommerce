import React, { createContext, useContext, useState } from "react";
import { toast } from "react-hot-toast";

const Context = createContext();

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);
  let foundProduct;
  let index;
  const onAdd = (product, quantity) => {
    const checkProductInCart = cartItems.find(
      (item) => item._id === product._id
    );
    setTotalPrice(
      (prevTotalPrice) => prevTotalPrice + product.price * quantity
    );
    setTotalQuantities((prevTotalQuantites) => prevTotalQuantites + quantity);
    if (checkProductInCart) {
      const updatedCartItems = cartItems.map((cartProduct) => {
        if (cartProduct._id == product._id) {
          return {
            ...cartProduct,
            quantity: cartProduct.quantity + quantity,
          };
        }
      });
      setCartItems(updatedCartItems);
    } else {
      product.quantity = quantity;
      setCartItems([...cartItems, { ...product }]);
    }
    toast.success(`${qty} ${product.name} added to the cart.`);
  };

  const deleteCartItem = (id) => {
    foundProduct = cartItems.find((item) => item._id == id);
    index = cartItems.findIndex((product) => product._id == id);
    let newCartItems = [...cartItems];
    newCartItems.splice(index, 1);
    setCartItems(newCartItems);
    setTotalPrice(
      (prevTotalPrice) =>
        prevTotalPrice - foundProduct.price * foundProduct.quantity
    );
    setTotalQuantities(
      (prevTotalQuantites) => prevTotalQuantites - foundProduct.quantity
    );
  };
  const togglecartItemQuantity = (id, value) => {
    foundProduct = cartItems.find((item) => item._id == id);

    index = cartItems.findIndex((product) => product._id == id);
    let newCartItems = [...cartItems];
    if (value === "inc") {
      foundProduct.quantity += 1;
      newCartItems[index] = foundProduct;
      // newCartItems = [
      //   ...newCartItems,
      //   { ...foundProduct, quantity: foundProduct.quantity + 1 },
      // ];
      setCartItems([...newCartItems]);
      setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
      setTotalQuantities((prevTotalQuantites) => prevTotalQuantites + 1);
    } else if (value === "dec") {
      if (foundProduct.quantity > 1) {
        foundProduct.quantity -= 1;
        newCartItems[index] = foundProduct;
        // newCartItems = [
        //   ...newCartItems,
        //   { ...foundProduct, quantity: foundProduct.quantity + 1 },
        // ];
        setCartItems([...newCartItems]);
        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
        setTotalQuantities((prevTotalQuantites) => prevTotalQuantites - 1);
      } else {
        deleteCartItem(id);
      }
    }
    //foundProduct.quantity = value;
  };

  const incQty = () => {
    setQty((prevQty) => prevQty + 1);
  };
  const decQty = () => {
    setQty((prevQty) => {
      if (prevQty - 1 < 1) return 1;

      return prevQty - 1;
    });
  };

  return (
    <Context.Provider
      value={{
        showCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        incQty,
        decQty,
        onAdd,
        setShowCart,
        togglecartItemQuantity,
        deleteCartItem,
        setCartItems,
        setTotalPrice,
        setTotalQuantities,
        setQty,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
