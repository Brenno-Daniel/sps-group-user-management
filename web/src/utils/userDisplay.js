import { USER_TYPE_OPTIONS } from "../components/users/userTypes";

export function getUserTypeLabel(value) {
  const o = USER_TYPE_OPTIONS.find((x) => x.value === value);
  return o ? o.label : value;
}
