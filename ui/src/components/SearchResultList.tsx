import { Grocery } from "@/models/grocery";
import { trackGrocery } from "@/actions/trackGrocery";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

interface Props {
  products: Grocery[];
}

export default function SearchResultList(props: Readonly<Props>) {
  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="groceries search result table">
        <TableHead>
          <TableRow>
            <TableCell>Num.</TableCell>
            <TableCell>Product Name</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.products.map((grocery) => (
            <TableRow key={grocery.index}>
              <TableCell>{grocery.index}</TableCell>
              <TableCell>
                <a href={grocery.url} target="_blank" rel="noreferrer">
                  {grocery.display_name}
                </a>
              </TableCell>
              <TableCell>A$ {grocery.price}</TableCell>
              <TableCell>
                <button type="submit" onClick={() => trackGrocery(grocery)}>Save</button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
