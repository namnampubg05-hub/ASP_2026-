import React, { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState([]);

    const addItem = useCallback((product) => {
        setItems(prev => {
            const existing = prev.find(i => i.id === product.id);
            const stock = product.stockQuantity ?? 999;
            if (existing) {
                if (existing.quantity + 1 > stock) {
                    alert(`Chỉ còn ${stock} sản phẩm trong kho`);
                    return prev;
                }
                return prev.map(i =>
                    i.id === product.id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            if (1 > stock) {
                alert('Sản phẩm đã hết hàng');
                return prev;
            }
            return [...prev, { ...product, quantity: 1, stockQuantity: stock }];
        });
    }, []);

    const removeItem = useCallback((id) => {
        setItems(prev => prev.filter(i => i.id !== id));
    }, []);

    const updateQuantity = useCallback((id, quantity) => {
        if (quantity <= 0) {
            removeItem(id);
            return;
        }
        setItems(prev => {
            const item = prev.find(i => i.id === id);
            if (item) {
                const stock = item.stockQuantity ?? 999;
                if (quantity > stock) {
                    alert(`Chỉ còn ${stock} sản phẩm trong kho`);
                    return prev;
                }
            }
            return prev.map(i =>
                i.id === id ? { ...i, quantity } : i
            );
        });
    }, [removeItem]);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <CartContext.Provider value={{
            items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            totalItems,
            totalPrice
        }}>
            {children}
        </CartContext.Provider>
    );
};
