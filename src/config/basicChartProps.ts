import { Author } from '../utils/types.ts'
import type { PropType } from 'vue'
// import { defineProps } from 'vue'

// export default function setBasicProps() {
//   console.log({ ...extraProps })

const props = {
  data: {
    type: Object as PropType<Author[]>,
    required: true,
  },

  showRelative: {
    type: Boolean,
    default: false,
  },
}
export default props
