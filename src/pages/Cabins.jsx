import { useEffect } from "react";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import { getCabins } from "../services/apiCabins";

export default function Cabins() {
  useEffect(() => {
    const fetchedCabins = async () => {
      const cabins = await getCabins();
      console.log(cabins);
    };

    fetchedCabins();
  }, []);

  return (
    <Row type="horizontal">
      <Heading as="h1">All cabins</Heading>
      <p>TEST</p>
    </Row>
  );
}
