import styled from "styled-components";

const StyledSideBar = styled.aside`
  background-color: var(--color-grey-0);
  padding: 3.2rem 2.4rem;
  border-right: 1px solid var(--color-grey-100);

  /* Display the sidebar on the left and occupying both rows of the grid*/
  grid-row: 1 / -1;

  /* Smaller Screens */
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

export default function SideBar() {
  return <StyledSideBar>Sidebar</StyledSideBar>;
}
