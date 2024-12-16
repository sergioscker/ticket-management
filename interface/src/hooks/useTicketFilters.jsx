import { useState, useCallback, useMemo } from 'react';

const useTicketFilters = (initialTickets) => {
  const [searchText, setSearchText] = useState('');
  const [selectedStates, setSelectedStates] = useState([]);

  const handleSearchChange = useCallback((data) => {
    setSearchText(data.target.value);
  }, []);

  const handleStateToggle = useCallback(
    (state) => {
      console.log('Before update - selectedStates:', selectedStates);
      setSelectedStates((prevStates) => {
        const stateSet = new Set(prevStates);

        if (stateSet.has(state)) {
          stateSet.delete(state);
        } else {
          stateSet.add(state);
        }
        return Array.from(stateSet);
      });
    },
    [selectedStates],
  );

  const isStateSelected = useCallback(
    (state) => {
      return selectedStates.includes(state);
    },
    [selectedStates],
  );

  const filteredTickets = useMemo(() => {
    return initialTickets.filter((ticket) => {
      {
        /* search input text or description */
      }

      const matchesSearch =
        ticket.title.toLowerCase().includes(searchText.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchText.toLowerCase());

      const matchesState =
        selectedStates.length === 0 ||
        selectedStates.some(
          (state) => state.toLowerCase() === ticket.state.title.toLowerCase(),
        );

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
