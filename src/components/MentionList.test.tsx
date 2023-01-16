import {
  render,
  waitFor,
  getByText,
  getAllByText,
  fireEvent,
} from "@testing-library/react";
import MentionList from "./MentionList";

describe("MentionList", () => {
  it("should fetch and display most mentioned users", async () => {
    const mockResponse = {
      json: jest.fn().mockResolvedValue([
        { id: 1, username: "user1" },
        { id: 2, username: "user2" },
      ]),
    };
    window.fetch = jest.fn().mockResolvedValue(mockResponse);
    const { getByText, getAllByText } = render(<MentionList />);

    await waitFor(() => {
      expect(getByText("Most Mentioned Users"));
      expect(getByText("user1"));
      expect(getByText("user2"));
      expect(getAllByText("user1")).toHaveLength(1);
      expect(getAllByText("user2")).toHaveLength(1);
    });
  });
});
