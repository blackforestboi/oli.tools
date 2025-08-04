import styled from "styled-components";
import { useLogic } from "../../hooks/useLogic";
import {
  type TemplateComponentDependencies,
  TemplateComponentLogic,
} from "./logic";
export default function TemplateComponent(
  props: TemplateComponentDependencies
) {
  // @ts-ignore
  const { logic, state } = useLogic(TemplateComponentLogic, props);

  return <Container>test11</Container>;
}

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  height: 100vh;
  min-width: 300px;
`;
