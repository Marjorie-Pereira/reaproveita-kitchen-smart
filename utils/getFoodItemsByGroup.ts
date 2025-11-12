import { foodItem } from "@/types/FoodListItemProps";

const getExpiredItems = (items: foodItem[], id: string | null = null) => {
  return items.filter((item) => {
    const expirationDate = new Date(item.data_validade);

    return (
      expirationDate.getTime() < new Date().getTime() &&
      (id ? item.id_ambiente === id : true)
    );
  });
};

const getExpiringItems = (items: foodItem[], id: string | null = null) => {
  return items.filter((item) => {
    const expirationDate = new Date(item.data_validade);
    const notExpired = expirationDate.getDate() >= new Date().getDate();

    return (
      notExpired &&
      expirationDate.getDate() - new Date().getDate() <= 7 &&
      (id ? item.id_ambiente === id : true)
    );
  });
};

const getOpenItems = (items: foodItem[], id: string | null = null) => {
  return [
    ...items.filter(
      (item) =>
        item.status === "Aberto" && (id ? item.id_ambiente === id : true)
    ),
  ];
};

const getLeftovers = (items: foodItem[], id: string | null = null) => {
  return [];
};

export { getExpiredItems, getExpiringItems, getLeftovers, getOpenItems };
