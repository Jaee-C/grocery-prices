import { Grocery } from "@/models/grocery";
import { trackGrocery } from "@/actions/trackGrocery";

interface Props {
  products: Grocery[];
}

export default function SearchResultList(props: Props) {
  return (
    <ul>
      {props.products.map((grocery) => (
        <li key={grocery.index}>
          <a href={grocery.url} target="_blank" rel="noreferrer">
            {grocery.display_name}
          </a>
          <div>A$ {grocery.price}</div>
          <button type="submit" onClick={() => trackGrocery(grocery)}>Save</button>
        </li>
      ))}
    </ul>
  );
}
