import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import Intro from "./pages/introp1";

let observer;
let disconnect;
let scrollIntoView;
let reduced;
beforeEach(() => {
  reduced = false;
  window.matchMedia = jest.fn(() => ({
    matches: reduced,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }));
  disconnect = jest.fn();
  window.IntersectionObserver = jest.fn((callback) => {
    observer = callback;
    return { observe: jest.fn(), disconnect };
  });
  scrollIntoView = jest.fn();
  Element.prototype.scrollIntoView = scrollIntoView;
  Element.prototype.getBoundingClientRect = function () {
    return {
      top: ["discover", "share", "points", "login"].indexOf(this.id) * 1000,
    };
  };
});

test("renders every chapter and navigates with next, skip, dots and replay", () => {
  render(<Intro />);
  expect(screen.getAllByRole("region")).toHaveLength(4);
  fireEvent.click(screen.getByRole("button", { name: "Keep exploring" }));
  expect(scrollIntoView.mock.instances[0].id).toBe("share");
  fireEvent.click(screen.getByRole("button", { name: "Skip intro" }));
  expect(scrollIntoView.mock.instances[1].id).toBe("login");
  fireEvent.click(screen.getByRole("button", { name: "Skill points" }));
  expect(scrollIntoView.mock.instances[2].id).toBe("points");
  fireEvent.click(
    screen.getByRole("button", { name: "Replay the introduction" }),
  );
  expect(scrollIntoView.mock.instances[3].id).toBe("discover");
});

test("toggles password and submits the preview without retaining the password", () => {
  render(<Intro />);
  const password = screen.getByLabelText("Password");
  fireEvent.change(screen.getByLabelText("Email address"), {
    target: { value: "test@example.com" },
  });
  fireEvent.change(password, { target: { value: "test-password" } });
  fireEvent.click(screen.getByRole("button", { name: "Show password" }));
  expect(password).toHaveAttribute("type", "text");
  fireEvent.click(screen.getByRole("button", { name: "Hide password" }));
  expect(password).toHaveAttribute("type", "password");
  fireEvent.click(screen.getByRole("button", { name: "Log in" }));
  expect(screen.getByRole("status")).toHaveTextContent("ready to connect");
  expect(password).toHaveValue("");
});

test("reveals chapters and cleans up observers and animation timers on unmount", () => {
  jest.useFakeTimers();
  const { container, unmount } = render(
    <React.StrictMode>
      <Intro />
    </React.StrictMode>,
  );
  const chapter = container.querySelector(".chapter");
  act(() => observer([{ target: chapter, isIntersecting: true }]));
  expect(chapter).toHaveClass("is-visible");
  fireEvent.click(screen.getByRole("button", { name: "Keep exploring" }));
  expect(container.querySelector(".ripple")).toBeInTheDocument();
  unmount();
  expect(disconnect).toHaveBeenCalledTimes(2);
  expect(jest.getTimerCount()).toBe(0);
  jest.useRealTimers();
});

test("respects reduced motion during navigation", () => {
  reduced = true;
  const { container } = render(<Intro />);
  fireEvent.click(screen.getByRole("button", { name: "Keep exploring" }));
  expect(scrollIntoView).toHaveBeenCalledWith({
    behavior: "auto",
    block: "start",
  });
  expect(container.querySelector(".ripple")).not.toBeInTheDocument();
});
