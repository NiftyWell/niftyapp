<template>
    <div class="filter-section">
      <div class="trait-filter" v-for="(values, type) in allTraits" :key="type">
        <div class="search-bar">
          <input
            type="text"
            v-model="search[type]"
            @input="filterTraits(type)"
            @focus="showDropdown(type)"
            @blur="handleBlur(type, $event)"
            @keydown.enter.prevent="selectFirstTrait(type)"
            :placeholder="`${type} trait...`"
            :ref="`searchInput_${type}`"
          >
          <div class="tags">
            <span class="tag" v-for="value in selectedFilters[type]" :key="`tag-${type}-${value}`" @click.stop="removeTag(type, value)">
              {{ value }}
              <span class="remove-tag" @click.stop="removeTag(type, value)">&times;</span>
            </span>
          </div>
        </div>
        <div v-show="dropdownVisible[type]" class="dropdown-list" :ref="`dropdown_${type}`">
          <div v-for="value in filteredTraits[type]" :key="`option-${type}-${value}`" @click="toggleSelection(type, value)">
            {{ value }}
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, reactive, watchEffect } from 'vue';

const props = defineProps({
  allTraits: Object,
  selectedFilters: Object
});

const search = reactive({});
const dropdownVisible = reactive({});
const filteredTraits = reactive({});

// Initialize reactive properties for each trait type
watchEffect(() => {
  Object.keys(props.allTraits).forEach(type => {
    search[type] = '';
    dropdownVisible[type] = false;
    filteredTraits[type] = [...props.allTraits[type]];
    if (!Array.isArray(props.selectedFilters[type])) {
      props.selectedFilters[type] = [];
    }
  });
});

// Update the filtered traits list based on the search input
const filterTraits = (type) => {
  const searchTerm = search[type]?.toLowerCase() || '';
  filteredTraits[type] = props.allTraits[type].filter(trait =>
    trait.toLowerCase().includes(searchTerm)
  );
};

// Toggle the selection of a trait and reset the search input and filtered traits list
const toggleSelection = (type, value) => {
  const index = props.selectedFilters[type].indexOf(value);
  if (index >= 0) {
    props.selectedFilters[type].splice(index, 1);
  } else {
    props.selectedFilters[type].push(value);
    search[type] = '';
    filteredTraits[type] = [...props.allTraits[type]];
    dropdownVisible[type] = false; // Optionally hide the dropdown after selection
  }
};

// Show the dropdown when the search input is focused
const showDropdown = (type) => {
  dropdownVisible[type] = true;
};

// Handle the blur event to hide the dropdown if the focus is moved outside the search input
const handleBlur = (type) => {
  // Use a setTimeout to delay the check, allowing clicks on dropdown items to be registered before hiding it
  setTimeout(() => {
    dropdownVisible[type] = false;
  }, 100);
};

// Select the first trait in the filtered list when the Enter key is pressed
const selectFirstTrait = (type) => {
  if (filteredTraits[type].length > 0) {
    toggleSelection(type, filteredTraits[type][0]);
  }
};

// Remove a selected tag
const removeTag = (type, value) => {
  const index = props.selectedFilters[type].indexOf(value);
  if (index >= 0) {
    props.selectedFilters[type].splice(index, 1);
  }
};

</script>


<style scoped>
.filter-section {
  display: flex;
  flex-wrap: wrap; 
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.trait-filter {
  display: flex;
  flex-direction: column;
  position: relative;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 4px;
  padding: 0.5rem;
  height: 1rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  margin-left: 0.5rem;
}

.tag {
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  font-size: medium;
  padding: 0.1rem 0.2rem;
  margin-right: 0.25rem;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.remove-tag {
  display: inline-block;
  margin-left: 0.5rem;
  cursor: pointer;
}

.dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  max-height: 160px;
  overflow-y: auto;
  z-index: 10;
}

.dropdown-list div {
  padding: 0.5rem;
  cursor: pointer;
}

.dropdown-list div:hover {
  background-color: #f0f0f0;
}

input[type="text"] {
  flex-grow: 1;
  border: none;
  background-color: transparent;
}

input[type="text"]:focus {
  outline: none;
}
</style>
