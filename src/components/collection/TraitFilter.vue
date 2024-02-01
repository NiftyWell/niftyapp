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
let blurTimeoutId; // Variable to hold timeout ID

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

const filterTraits = (type) => {
  const searchTerm = search[type]?.toLowerCase() || '';
  filteredTraits[type] = props.allTraits[type].filter(trait =>
    trait.toLowerCase().includes(searchTerm)
  );
};

const toggleSelection = async (type, value) => {
  clearTimeout(blurTimeoutId); // Clear the timeout to prevent dropdown from closing
  const index = props.selectedFilters[type].indexOf(value);
  if (index >= 0) {
    props.selectedFilters[type].splice(index, 1);
  } else {
    props.selectedFilters[type].push(value);
  }
  search[type] = '';
  filteredTraits[type] = [...props.allTraits[type]];
  dropdownVisible[type] = false;
};

const showDropdown = (type) => {
  dropdownVisible[type] = true;
};

const handleBlur = (type, event) => {
  blurTimeoutId = setTimeout(() => {
    dropdownVisible[type] = false;
  }, 200); // Delay to allow click event registration
};

const selectFirstTrait = (type) => {
  if (filteredTraits[type].length > 0) {
    toggleSelection(type, filteredTraits[type][0]);
  }
};

const removeTag = (type, value) => {
  const index = props.selectedFilters[type].indexOf(value);
  if (index >= 0) {
    props.selectedFilters[type].splice(index, 1);
  }
};
</script>



<style lang=scss scoped>
.filter-section {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
  margin-bottom: 1rem;

  .trait-filter {
    display: flex;
    flex-direction: column;
    position: relative;

    .search-bar {
      display: flex;
      align-items: center;
      background-color: #f0f0f0;
      border-radius: 4px;
      padding: 0.5rem;
      height: 1rem;
      min-width: 7rem;

      input {
        font-family: "NiftyFont", sans-serif !important;
        font-size: medium;
        text-transform: uppercase;
        flex-grow: 1;
        border: none;
        background-color: transparent;

        &:focus {
          outline: none;
        }
      }
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      margin-left: 0.5rem;

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

        .remove-tag {
          display: inline-block;
          margin-left: 0.5rem;
          cursor: pointer;
        }
      }
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

      div {
        padding: 0.5rem;
        cursor: pointer;

        &:hover {
          background-color: #e7e7e7;
        }
      }
    }
  }
}

</style>
