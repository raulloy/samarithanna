export const apiURL = 'https://samarithanna-api.onrender.com';

export const productsReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, error: action.payload, loading: false };

    default:
      return state;
  }
};

export const productReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, error: action.payload, loading: false };

    default:
      return state;
  }
};

export const orderReducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};

export const getOrderReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export const getOrdersReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, orders: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export const getError = (error) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};

export const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

export function formatDate(dateString) {
  const date = new Date(Date.parse(dateString));
  const utcDate = new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds()
    )
  );
  const day = utcDate.getUTCDate().toString().padStart(2, '0');
  const month = (utcDate.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = utcDate.getUTCFullYear();
  return `${day}-${month}-${year}`;
}

export const chartOptions = {
  hAxis: {
    gridlines: {
      color: 'transparent', // Removes horizontal gridlines
    },
  },
  vAxis: {
    gridlines: {
      color: 'transparent', // Removes vertical gridlines
    },
    textStyle: {
      fontSize: 10,
      bold: false,
    },
  },
  annotations: {
    stem: {
      // length: 10,
      color: '#fff',
    },
  },
  legend: { position: 'none' }, // Adjust legend position if needed
  tooltip: { isHtml: true, trigger: 'focus' },
};
