<template>
  <div class="flex flex-col">
           
      <div class="card">
        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                <IconField iconPosition="left" class="block mt-2 md:mt-0">
                  <InputIcon class="pi pi-search" />
                  <InputText class="w-full sm:w-auto"  placeholder="Search..." />
                </IconField>
              </div>
          <div class="font-semibold text-xl">DataView</div>
          <DataView :value="products" :layout="layout">
              <template #header>
                  <div class="flex justify-end">
                      <SelectButton v-model="layout" :options="options" :allowEmpty="true">
                          <template #option="{ option }">
                              <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-table']" />
                          </template>
                      </SelectButton>
                  </div>
              </template>
              

              <template #list="slotProps">
                  <div class="flex flex-col">
                      <div v-for="(item, index) in slotProps" :key="index">
                          <div v-if="item.name" class="flex flex-col sm:flex-row sm:items-center p-6 gap-4" :class="{ 'border-t border-surface': index !== 0 }">
                              <div class="md:w-40 relative">
                                  <img class="block xl:block mx-auto rounded w-full img-influencer" :src="`/demo/images/influencer/${item.image}`" :alt="item.name" />
                                  <Tag :value="item.inventoryStatus" :severity="getSeverity(item)" class="absolute dark:!bg-surface-900" style="left: 4px; top: 4px"></Tag>
                              </div>
                              <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6 gap-6-list">
                                  <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                                      <div class="list-name">
                                          <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ item.category }}</span>
                                          <div class="text-lg font-medium mt-2">{{ item.name }}</div>
                                      </div>
                                      <div class="bg-surface-100 p-1" style="border-radius: 30px">
                                          <div
                                              class="bg-surface-0 flex items-center gap-2 justify-center py-1 px-2"
                                              style="
                                                  border-radius: 30px;
                                                  box-shadow:
                                                      0px 1px 2px 0px rgba(0, 0, 0, 0.04),
                                                      0px 1px 2px 0px rgba(0, 0, 0, 0.06);
                                              "
                                          >
                                              <span class="text-surface-900 font-medium text-sm">{{ item.rating }}</span>
                                              <i class="pi pi-star-fill text-yellow-500"></i>
                                          </div>
                                      </div>
                                  </div>
                                  <div class="flex flex-col md:items-end gap-8">
                                      <span class="text-xl font-semibold">${{ item.price }}</span>
                                      <div class="flex flex-row-reverse md:flex-row gap-2">
                                          <Button icon="pi pi-heart"class="heart-influencer" outlined></Button>
                                          <Button icon="pi pi-shopping-cart" label="Buy Now" :disabled="item.inventoryStatus === 'OUTOFSTOCK'" class="flex-auto md:flex-initial whitespace-nowrap button-influencer"></Button>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </template>
              <template #grid="slotProps">

                  <div class="grid grid-cols-12 gap-4">
                      <div v-for="(item, index) in slotProps" :key="index" class="col-span-12 sm:col-span-6 lg:col-span-4 p-2">
                          <div v-if="item.name" class="p-6 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded flex flex-col">
                              <div class="bg-surface-50 flex justify-center rounded p-4">
                                  <div class="relative mx-auto">
                                      <img class="rounded w-full img-influencer" :src="`/demo/images/influencer/${item.image}`" :alt="item.name" style="max-width: 300px" />
                                      <Tag :value="item.inventoryStatus" :severity="getSeverity(item)" class="absolute dark:!bg-surface-900" style="left: 4px; top: 4px"></Tag>
                                  </div>
                              </div>
                              <div class="pt-6">
                                  <div class="flex flex-row justify-between items-start gap-2">
                                      <div class="grib-name">
                                          <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ item.category }}</span>
                                          <div class="text-lg font-medium mt-1">{{ item.name }}</div>
                                      </div>
                                      <div class="bg-surface-100 p-1" style="border-radius: 30px">
                                          <div
                                              class="bg-surface-0 flex items-center gap-2 justify-center py-1 px-2"
                                              style="
                                                  border-radius: 30px;
                                                  box-shadow:
                                                      0px 1px 2px 0px rgba(0, 0, 0, 0.04),
                                                      0px 1px 2px 0px rgba(0, 0, 0, 0.06);
                                              "
                                          >
                                              <span class="text-surface-900 font-medium text-sm">{{ item.rating }}</span>
                                              <i class="pi pi-star-fill text-yellow-500"></i>
                                          </div>
                                      </div>
                                  </div>
                                  <div class="flex flex-col gap-6 mt-6">
                                      <span class="text-2xl font-semibold">${{ item.price }}</span>
                                      <div class="flex gap-2">
                                          <Button icon="pi pi-shopping-cart" label="Buy Now" :disabled="item.inventoryStatus === 'OUTOFSTOCK'" class="flex-auto whitespace-nowrap button-influencer"></Button>
                                          <Button icon="pi pi-heart" class="heart-influencer" outlined></Button>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </template>
          </DataView>

      

      </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { ProductService } from '@/service/ProductService';

export default {
  data() {
    return {
      products: null,
      picklistProducts: null,
      orderlistProducts: null,
      options: ['list', 'grid'],
      layout: 'grid',
      filters: {},

    };
  },
  methods: {
    getSeverity(product) {
      switch (product.inventoryStatus) {
        case 'INSTOCK':
          return 'success';
        case 'LOWSTOCK':
          return 'warning';
        case 'OUTOFSTOCK':
          return 'danger';
        default:
          return null;
      }
    },
  },
  mounted() {
    const productService = new ProductService();
    productService.getProductsSmall().then((data) => {
      this.products = data;
      console.log(data);
      this.picklistProducts = [data, []];
      console.log(this.picklistProducts);
      this.orderlistProducts = data;
      console.log(this.products);

    });
  },
};
</script>
<style scoped>
@media screen and (min-width: 769px) {
  .gap-8  {
    display: block !important;
    margin-left: 50%;
}
  }
  @media screen and (max-width: 769px) {
  .gap-8  {
    display: block !important;
    margin-left: 0%;
}
  }
.list-name {
  width: 200px;
}
.img-influencer {
  width: max-content !important;
  max-width: 300px;
}
@media screen and (min-width: 769px) {
  .gap-6-list {
  width: 987px;
}
  }

.button-influencer
{
  border-radius: 30px;
}
.heart-influencer
{
  border-radius: 20px;

}
</style>