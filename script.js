document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.querySelector(".search-btn");
  const usernameInput = document.querySelector(".user-input");
  const stats = document.querySelector(".stats");
  const easyProgressCircle = document.querySelector(".easy-stat");
  const mediumProgressCircle = document.querySelector(".medium-stat");
  const hardProgressCircle = document.querySelector(".hard-stat");
  const allCircle = document.querySelector(".all-stat");
  const easyLabel = document.querySelector(".easy-label");
  const mediumLabel = document.querySelector(".medium-label");
  const hardLabel = document.querySelector(".hard-label");
  const allLabel = document.querySelector(".all-label");
  const error = document.querySelector(".error");
  const ranking = document.querySelector(".rank");
  const circles = document.querySelectorAll(".circle");

  const backendUrl = "https://leetmetric-chpy.onrender.com/leetcode";

  function validateUsername(username) {
    if (username.trim() === "") {
      error.textContent = "Username cannot be empty!";
      error.style.display = "block";
      hideCircles();
      hideRank();
      return false;
    }
    const regex = /^(?!.*__)[a-zA-Z0-9](?!.*_$)[a-zA-Z0-9_]{1,14}[a-zA-Z0-9]$/;
    if (!regex.test(username)) {
      error.textContent = "Invalid username format!";
      error.style.display = "block";
      hideCircles();
      hideRank();
      return false;
    }
    error.style.display = "none";
    showCircles();
    showRank();
    return true;
  }

  async function fetchUserDetails(username) {
    try {
      searchButton.innerHTML = '<img src="searching.svg" alt="Searching">';
      searchButton.disabled = true;

      const response = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) throw new Error("Unable to fetch user details");

      const parsedata = await response.json();

      if (!parsedata.data.matchedUser) {
        stats.innerHTML = '<p class="notFound">User not found!</p>';
        hideRank();
        return;
      }

      displayUserData(parsedata);
    } catch (err) {
      console.error(err);
      stats.innerHTML = '<p class="notFound">No Data Found</p>';
      hideRank();
    } finally {
      searchButton.innerHTML = '<img src="search.svg" alt="Search">';
      searchButton.disabled = false;
    }
  }

  function updateProgress(solved, total, label, circle) {
    const progressDegree = (solved / total) * 100;
    circle.style.setProperty("--progress-degree", `${progressDegree}%`);
    label.textContent = `${
      label.textContent.split(":")[0]
    }: ${solved}/${total}`;
  }

  function updateRank(rank) {
    ranking.textContent = `Rank: ${rank || "N/A"}`;
  }

  function displayUserData(parsedata) {
    const allQuestions = parsedata.data.allQuestionsCount;
    const solvedStats = parsedata.data.matchedUser.submitStats.acSubmissionNum;
    const rankDetails = parsedata.data.matchedUser.profile.ranking;

    const totalQues = allQuestions.find((q) => q.difficulty === "All").count;
    const totalEasyQues = allQuestions.find(
      (q) => q.difficulty === "Easy"
    ).count;
    const totalMediumQues = allQuestions.find(
      (q) => q.difficulty === "Medium"
    ).count;
    const totalHardQues = allQuestions.find(
      (q) => q.difficulty === "Hard"
    ).count;

    const solvedTotalQuest = solvedStats.find(
      (q) => q.difficulty === "All"
    ).count;
    const solvedEasy = solvedStats.find((q) => q.difficulty === "Easy").count;
    const solvedMedium = solvedStats.find(
      (q) => q.difficulty === "Medium"
    ).count;
    const solvedHard = solvedStats.find((q) => q.difficulty === "Hard").count;

    updateProgress(solvedEasy, totalEasyQues, easyLabel, easyProgressCircle);
    updateProgress(
      solvedMedium,
      totalMediumQues,
      mediumLabel,
      mediumProgressCircle
    );
    updateProgress(solvedHard, totalHardQues, hardLabel, hardProgressCircle);
    updateProgress(solvedTotalQuest, totalQues, allLabel, allCircle);
    updateRank(rankDetails);
  }

  function hideCircles() {
    circles.forEach((circle) => (circle.style.display = "none"));
  }
  function showCircles() {
    circles.forEach((circle) => (circle.style.display = "flex"));
  }
  function hideRank() {
    ranking.style.display = "none";
  }
  function showRank() {
    ranking.style.display = "flex";
  }

  searchButton.addEventListener("click", function () {
    const username = usernameInput.value;
    if (validateUsername(username)) fetchUserDetails(username);
  });

  usernameInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      const username = usernameInput.value;
      if (validateUsername(username)) fetchUserDetails(username);
    }
  });
});
