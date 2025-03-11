use PHPUnit\Framework\TestCase;

class StudySessionTest extends TestCase {
    public function testCreateSession() {
        $userId = 1;
        $partnerId = 2;
        $subject = "Math";
        $sessionDate = "2025-03-10 10:00:00";

        $stmt = $pdo->prepare("INSERT INTO study_sessions (user1_id, user2_id, subject, session_date) VALUES (?, ?, ?, ?)");
        $this->assertTrue($stmt->execute([$userId, $partnerId, $subject, $sessionDate]));
    }
}
