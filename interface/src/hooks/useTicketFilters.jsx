import { useState, useCallback, useMemo } from 'react';

const useTicketFilters = (initialTickets) => {
  const [searchText, setSearchText] = useState('');
  const [selectedStates, setSelectedStates] = useState([]);

  const handleSearchChange = useCallback((event) => {
    setSearchText(event.target.value);
  }, []);

  const handleStateToggle = useCallback((state) => {
    setSelectedStates((prevStates) => {
      const stateSet = new Set(prevStates);
      if (stateSet.has(state)) {
        stateSet.delete(state);
      } else {
        stateSet.add(state);
      }
      return Array.from(stateSet);
    });
  }, []);

  const isStateSelected = useCallback(
    (state) => {
      return selectedStates.includes(state);
    },
    [selectedStates],
  );

  const filteredTickets = useMemo(() => {
    return initialTickets.filter((ticket) => {
      const matchesSearch = ticket.title
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const matchesState =
        selectedStates.length === 0 ||
        selectedStates.includes(ticket.state.title);
      return matchesSearch && matchesState;
    });
  }, [initialTickets, searchText, selectedStates]);

  return {
    searchText,
    selectedStates,
    handleSearchChange,
    handleStateToggle,
    isStateSelected,
    filteredTickets,
  };
};

export { useTicketFilters };
