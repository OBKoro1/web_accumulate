import setPrototypeOf from "./setPrototypeOf";
export default function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  setPrototypeOf(subClass.prototype, superClass && superClass.prototype);
  if (superClass) setPrototypeOf(subClass, superClass);
}