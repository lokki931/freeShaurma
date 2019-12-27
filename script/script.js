document.addEventListener("DOMContentLoaded", () => {
    "use strict";
    const customer = document.getElementById("customer"),
        freelancer = document.getElementById("freelancer"),
        blockCustomer = document.getElementById("block-customer"),
        blockFreelancer = document.getElementById("block-freelancer"),
        blockChoice = document.getElementById("block-choice"),
        btnExit = document.getElementById("btn-exit"),
        formCustomer = document.getElementById("form-customer"),
        ordersTable = document.getElementById('orders'),
        modalOrder = document.getElementById('order_read'),
        modalOrderActive = document.getElementById('order_active'),
        headTable = document.getElementById('head-table'),
        orders = JSON.parse(localStorage.getItem('freeOrders')) || [];

    const toStaroge = () => {
        localStorage.setItem('freeOrders', JSON.stringify(orders));
    };
    const declOfNum = (number, titles) => number + ' ' + titles[(number % 100 > 4 && number % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(number % 10 < 5) ? number % 10 : 5]];

    const calcDeadline = (data) => {
        const deadline = new Date(data);
        const toDay = Date.now();

        const dDisplay = (deadline - toDay) / 1000 / 60 / 60;

        if (dDisplay / 24 > 2) {
            return declOfNum(Math.floor(dDisplay / 24), ['день', 'дня', 'дней']);
        }

        return declOfNum(Math.floor(dDisplay), ['час', 'часа', 'часов']);
    }

    const rederOrders = () => {
        ordersTable.textContent = '';
        orders.forEach((order, i) => {
            ordersTable.innerHTML += `
                    <tr class="order ${order.active ? 'taken' : ''}" 
                        data-number-order="${i}">
                        <td>${i+1}</td>
                        <td>${order.title}</td>
                        <td class="${order.currency}"></td>
                        <td>${calcDeadline(order.deadline)}</td>
                    </tr>`;

        });
    };

    const handlerModal = (e) => {
        const target = e.target;
        const modal = target.closest('.order-modal');
        const order = orders[modal.id];

        const baseAction = () => {
            modal.style.display = 'none';
            toStaroge();
            rederOrders();

        }
        if (target.closest('.close') || target === modal) {
            modal.style.display = 'none';
        }

        if (target.classList.contains("get-order")) {
            order.active = true;
            baseAction();
        }

        if (target.id === "capitulation") {
            order.active = false;
            baseAction();
        }

        if (target.id === "ready") {
            orders.splice(orders.indexOf(order), 1);
            baseAction()
        }
    }

    const openModal = (numberOrder) => {
        const order = orders[numberOrder];

        const { title, firstName, email, description, deadline, currency, amount, phone, active = false } = order;

        const modal = active ? modalOrderActive : modalOrder;

        const fistNameBlock = modal.querySelector('.firstName'),
            titleBlock = modal.querySelector('.modal-title'),
            emailBlock = modal.querySelector('.email'),
            descriptionBlock = modal.querySelector('.description'),
            deadlineBlock = modal.querySelector('.deadline'),
            currencyBlock = modal.querySelector('.currency_img'),
            countBlock = modal.querySelector('.count'),
            phoneBlock = modal.querySelector('.phone');

        modal.id = numberOrder;

        titleBlock.textContent = title;
        fistNameBlock.textContent = firstName;
        emailBlock.textContent = email;
        emailBlock.setAttribute("href", `mailto:${email}`);
        descriptionBlock.textContent = description;
        deadlineBlock.textContent = calcDeadline(deadline);
        currencyBlock.className = 'currency_img';
        currencyBlock.classList.add(`${currency}`);
        countBlock.textContent = amount;
        phoneBlock ? phoneBlock.href = `tel:${phone}` : '';

        modal.addEventListener('click', handlerModal);

        modal.style.display = 'flex';
    }

    ordersTable.addEventListener('click', (e) => {
        const target = e.target;

        const targetOrder = target.closest('.order');
        if (targetOrder) {
            openModal(targetOrder.dataset.numberOrder);
        }

    });
    customer.addEventListener("click", () => {
        blockChoice.style.display = "none";
        const toDay = new Date().toISOString().substring(0, 10);

        document.getElementById('deadline').min = toDay;

        blockCustomer.style.display = "block";
        btnExit.style.display = "block";
    });
    freelancer.addEventListener("click", () => {
        blockChoice.style.display = "none";
        rederOrders();
        blockFreelancer.style.display = "block";
        btnExit.style.display = "block";
    });
    btnExit.addEventListener("click", () => {
        btnExit.style.display = "none";
        blockChoice.style.display = "block";
        blockFreelancer.style.display = "none";
        blockCustomer.style.display = "none";
    });

    const sortOrder = (arr, prop) => {
        arr.sort((a, b) => a[prop] > b[prop] ? 1 : -1);
    };

    headTable.addEventListener('click', (e) => {
        const target = e.target;

        if (target.id === 'titleSort') {
            sortOrder(orders, 'title');
        }
        if (target.id === 'currencySort') {
            sortOrder(orders, 'currency');
        }
        if (target.id === 'deadlineSort') {
            sortOrder(orders, 'deadline');
        }
        toStaroge();
        rederOrders();

    })
    formCustomer.addEventListener("submit", e => {
        e.preventDefault();
        const elements = formCustomer.elements,
            obj = {};
        Array.from(elements).forEach((element) => {
            if ((element.tagName === 'INPUT' && element.type !== 'radio') ||
                (element.type === 'radio' && element.checked) ||
                element.tagName === 'TEXTAREA') {
                obj[element.name] = element.value;
            }
        });
        formCustomer.reset();
        orders.push(obj);
        toStaroge();

    });


});