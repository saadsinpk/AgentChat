import React, { useState } from 'react';
// import {
//   Flex,
//   Input,
//   InputGroup,
//   InputLeftElement,
//   InputRightElement,
//   IconButton,
// } from '@chakra-ui/react';
import { FiSearch, FiX } from 'react-icons/fi';

function SearchBar({SearchValue}) {
  const [search, setsearch] = useState('');

  const handleSearch=(e)=>{
    console.log(e.target.value);
    setsearch(e.target.value)
    SearchValue(e.target.value)
  }
  const handleClear = () => setsearch('');

  return (
    // <Flex justify="center" align="center" p="4" w="100%">
    //   <InputGroup w={{ base: '100%', md: '100%' }}>
    //     <InputLeftElement>
    //       <FiSearch color="gray.400" />
    //     </InputLeftElement>
    //     <Input
    //       type="text"
    //       placeholder="Search..."
    //       value={search}
    //       onChange={handleSearch}
    //       bg={"#19335F"}
    //       color={"white"}
    //       border="none"
    //       borderRadius="full"
    //       _focus={{
    //         outline: 'none',
    //         boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.2)',
    //       }}
    //     />
    //     <InputRightElement>
    //       {search && (
    //         <IconButton
    //           aria-label="Clear search"
    //           icon={<FiX />}
    //           size="sm"
    //           variant="ghost"
    //           onClick={handleClear}
    //         />
    //       )}
    //     </InputRightElement>
    //   </InputGroup>
    // </Flex>
    ''
  );
}

export default SearchBar;
