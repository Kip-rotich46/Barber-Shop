const bookingForm = document.querySelector("#booking-form");
const serviceSelect = document.querySelector("#service");
const dateInput = document.querySelector("#date");
const timeSelect = document.querySelector("#time");
const formMessage = document.querySelector("#form-message");

const allTimeSlots = Array.from(timeSelect.options).slice(1).map((option) => ({
  value: option.value,
  label: option.label,
}));

function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

dateInput.min = formatLocalDate(new Date());

dateInput.addEventListener("change", () => {
  const selectedDate = new Date(`${dateInput.value}T12:00:00`);
  const dayOfWeek = selectedDate.getDay();

  dateInput.setCustomValidity(
    dayOfWeek === 0 || dayOfWeek === 1
      ? "The shop is closed on Sundays and Mondays. Please choose another day."
      : "",
  );

  const selectedTime = timeSelect.value;
  const availableSlots = allTimeSlots.filter((slot) => {
    return dayOfWeek !== 6 || slot.value !== "5:00 PM";
  });

  timeSelect.replaceChildren(new Option("Choose a time", "", true, true));
  timeSelect.options[0].disabled = true;
  availableSlots.forEach((slot) => {
    timeSelect.add(new Option(slot.label, slot.value));
  });

  if (availableSlots.some((slot) => slot.value === selectedTime)) {
    timeSelect.value = selectedTime;
  }
});

dateInput.addEventListener("input", () => dateInput.setCustomValidity(""));

document.querySelectorAll("[data-service]").forEach((button) => {
  button.addEventListener("click", () => {
    serviceSelect.value = button.dataset.service;
    document.querySelector("#book").scrollIntoView({ behavior: "smooth" });
    serviceSelect.focus({ preventScroll: true });
  });
});

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!bookingForm.reportValidity()) return;

  const formData = new FormData(bookingForm);
  const selectedDate = new Date(`${formData.get("date")}T12:00:00`);

  if (selectedDate.getDay() === 0 || selectedDate.getDay() === 1) {
    dateInput.setCustomValidity(
      "The shop is closed on Sundays and Mondays. Please choose another day.",
    );
    dateInput.reportValidity();
    return;
  }

  formMessage.textContent =
    "Your request is ready, but this demo does not send or store it. Please contact the shop directly to confirm your appointment.";
  formMessage.focus();
});
