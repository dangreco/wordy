import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import styled from 'styled-components';

const Slider: React.FunctionComponent = ({
  children,
}) => {

  const visible = Array.isArray(children) ? children.length > 0 : true;

  return (
    <Root
      animate={{
        height: visible ? 'auto' : 0,
        transition: { duration: 0.2 }
      }}
    >
      <Inner>
        <AnimatePresence>
          { children }
        </AnimatePresence>
      </Inner>
    </Root>  
  )
};

export default Slider;

const Root = styled(motion.div)`
  width: 100%;
  overflow-x: scroll;
  overflow-y: hidden;
`;

const Inner = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;