import { child, ref } from "firebase/database";
import { realtimeDB } from "../../firebase";

export const getAllEqu = (equList, e, form) => {
  const id = [...equList].pop().id + 1;
  const equRef = child(ref(realtimeDB), "equ/" + id);
  const manufactureDate = e.equManufactureDate.valueOf();
  const expiryDate = e.equExpiryDate.valueOf();
  
  const allValues = form.getFieldsValue(true);

  const { equManufactureDate, equExpiryDate, ...otherValues } = allValues;

  set(equRef, {
    id: id,
    ...otherValues,
    equManufactureDate: manufactureDate,
    equExpiryDate: expiryDate,
    equStatus: 1
  })
    .then(toast.success("Add new equip success"), setIsOpenModal(false), setIsLoading(false))
    .catch((err) => {
      toast.error(err);
    });
}