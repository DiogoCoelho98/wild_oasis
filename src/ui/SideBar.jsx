import styled from "styled-components";
import Logo from "./Logo";
import MainNav from "./MainNav.jsx";

const StyledSideBar = styled.aside`
  background-color: var(--color-grey-0);
  padding: 3.2rem 2.4rem;
  border-right: 1px solid var(--color-grey-100);
  display: flex;
  flex-direction: column;
  gap: 3.2rem;

  /* Display the sidebar on the left and occupying both rows of the grid*/
  grid-row: 1 / -1;

  /* Smaller Screens */
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
  @media (max-width: 550px) {
    padding-top: 0;
  }
`;

export default function SideBar() {
  return (
    <StyledSideBar>
      <Logo />
      <MainNav />
    </StyledSideBar>
  );
}
