import type { Vue } from "vue/types/vue";
import type { PluginObject } from "vue/types/plugin";

type Nullable<T> = T | null;
type ShallowReactive<T> = T;
type View = ShallowReactive<{
  id: number;
  index: number;
  used: true;
  key: PropertyKey;
  type: unknown;
}>;
type CustomResizeEvent = CustomEvent<Pick<ResizeObserverEntry, "contentRect">>;
type ItemWrapper<Item = unknown> = {
  offset: number;
  position: number;
  item: {
    id: PropertyKey;
    item: Item;
    size: number;
  };
};

interface RecycleScroller<Item = unknown> extends Vue {
  $refs: {
    before?: HTMLElement;
    wrapper?: HTMLElement;
    after?: HTMLElement;
  };

  // data
  pool: ItemWrapper<Item>[];
  totalSize: number;
  ready: boolean;
  hoverKey: Nullable<PropertyKey>;

  // methods
  addView(
    pool: Item[],
    index: number,
    item: Item,
    key: PropertyKey,
    type: PropertyKey
  ): View;
  unuseView(view: View, fake?: boolean): void;
  handleResize(): void;
  handleScroll(): void;
  handleVisibilityChange(
    isVisible: boolean,
    entry: { boundingClientRect: { width: number; height: number } }
  ): void;
  updateVisibleItems(
    checkItem: Item,
    checkPositionDiff?: boolean
  ): { continuous: boolean };
  getListenerTarget(): Window | HTMLElement;
  getScroll(): { start: number; end: number };
  applyPageMode(): void;
  addListeners(): void;
  removeListeners(): void;
  scrollToItem(index: number): void;
  scrollToPosition(position: number): void;
  itemsLimitError(): never;
  sortViews(): void;
}

// @see https://github.com/Akryum/vue-virtual-scroller/tree/v1.1.2/packages/vue-virtual-scroller/src/components/DynamicScroller.vue
interface DynamicScroller<Item = unknown> extends Vue {
  $refs: {
    scroller: RecycleScroller<Item>;
  };

  $el: HTMLElement;

  // data
  vscrollData: {
    active: boolean;
    sizes: Record<PropertyKey, number>;
    validSizes: Record<PropertyKey, boolean>;
    keyField: PropertyKey;
    simpleArray: boolean;
  };

  // methods
  onScrollerResize(): void;
  onScrollerVisible(): void;
  forceUpdate(clear?: boolean): void;
  scrollToItem(index: number): void;
  getItemSize(item: Item, index?: number): number;
  scrollToBottom(): void;
}

// @see https://github.com/Akryum/vue-virtual-scroller/tree/v1.1.2/packages/vue-virtual-scroller/src/components/DynamicScrollerItem.vue
interface DynamicScrollerItem extends Vue {
  // methods
  updateSize(): void;
  updateWatchData(): void;
  onVscrollUpdate(params: { force: boolean }): void;
  onDataUpdate(): void;
  computeSize(id: PropertyKey): void;
  applySize(width: number, height: number): void;
  observeSize(): void;
  unobserveSize(): void;
  onResize(event: CustomResizeEvent): void;
}

type PluginOptions = {
  installComponents: boolean;
  componentsPrefix: string;
  itemsLimit: number;
};

declare const plugin: PluginObject<Partial<PluginOptions>>;

declare module "vue-virtual-scroller" {
  export { RecycleScroller, DynamicScroller, DynamicScrollerItem };
  export default plugin;
}

