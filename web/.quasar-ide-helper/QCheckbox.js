
/**
 * Quasar QCheckbox component
 * 
 * @see {@link https://v1.quasar-framework.org/vue-components/checkbox|Quasar Docs} (Generated link, may not always work)
 */  
export default {
  name: 'QCheckbox',
  props: {
    /**
     * Emitted when the component needs to change the model; Is also used by v-model
     * @param {*} value New model value 
     * @param {Object} evt JS event object 
     */      
    '@input': function (value,evt) {},
    /**
     * Used to specify the name of the control; Useful if dealing with forms submitted directly to a URL
     * @type {String}
     */
    name: {
      type: String,
    },
    /**
     * Size in CSS units, including unit name or standard size name (xs|sm|md|lg|xl)
     * @type {String}
     */
    size: {
      type: String,
    },
    /**
     * Model of the component; Either use this property (along with a listener for 'input' event) OR use v-model directive
     * @type {*|Array}
     */
    value: {
      required: true
    },
    /**
     * Works when model ('value') is Array. It tells the component which value should add/remove when ticked/unticked
     * @type {*}
     */
    val: {
    },
    /**
     * What model value should be considered as checked/ticked/on?
     * @type {*}
     */
    trueValue: {
    },
    /**
     * What model value should be considered as unchecked/unticked/off?
     * @type {*}
     */
    falseValue: {
    },
    /**
     * What model value should be considered as 'indeterminate'?
     * @type {*}
     */
    indeterminateValue: {
    },
    /**
     * Determines toggle order of the two states ('t' stands for state of true, 'f' for state of false); If 'toggle-indeterminate' is true, then the order is: indet -> first state -> second state -> indet (and repeat), otherwise: indet -> first state -> second state -> first state -> second state -> ...
     * @type {'tf'|'ft'}
     */
    toggleOrder: {
      type: String,
    },
    /**
     * Determines toggle order of the two states ('t' stands for state of true, 'f' for state of false); If 'toggle-indeterminate' is true, then the order is: indet -> first state -> second state -> indet (and repeat), otherwise: indet -> first state -> second state -> first state -> second state -> ...
     * @type {'tf'|'ft'}
     */
    'toggleOrder="tf"': {
      type: Boolean,
    },
    /**
     * Determines toggle order of the two states ('t' stands for state of true, 'f' for state of false); If 'toggle-indeterminate' is true, then the order is: indet -> first state -> second state -> indet (and repeat), otherwise: indet -> first state -> second state -> first state -> second state -> ...
     * @type {'tf'|'ft'}
     */
    'toggleOrder="ft"': {
      type: Boolean,
    },
    /**
     * When user clicks/taps on the component, should we toggle through the indeterminate state too?
     * @type {Boolean}
     */
    toggleIndeterminate: {
      type: Boolean,
    },
    /**
     * Label to display along the component (or use the default slot instead of this prop)
     * @type {String}
     */
    label: {
      type: String,
    },
    /**
     * Label (if any specified) should be displayed on the left side of the component
     * @type {Boolean}
     */
    leftLabel: {
      type: Boolean,
    },
    /**
     * Color name for component from the Quasar Color Palette
     * @type {String}
     */
    color: {
      type: String,
    },
    /**
     * Should the color (if specified any) be kept when the component is unticked/ off?
     * @type {Boolean}
     */
    keepColor: {
      type: Boolean,
    },
    /**
     * Notify the component that the background is a dark color
     * @type {Boolean}
     */
    dark: {
      type: Boolean,
    },
    /**
     * Dense mode; occupies less space
     * @type {Boolean}
     */
    dense: {
      type: Boolean,
    },
    /**
     * Put component in disabled mode
     * @type {Boolean}
     */
    disable: {
      type: Boolean,
    },
    /**
     * Tabindex HTML attribute value
     * @type {Number|String}
     */
    tabindex: {
      type: [Number,String],
    }
  }
}
