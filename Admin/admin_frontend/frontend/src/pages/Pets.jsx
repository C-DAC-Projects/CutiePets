import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPets, deletePet, deletePetImage } from "../services/petService";
import "../styles/pets.css";

function Pets() {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const petsPerPage = 10;

  // Fetch pets from API
  const fetchPets = async () => {
    setLoading(true);
    try {
      const petsData = await getAllPets();
      setPets(Array.isArray(petsData) ? petsData : []);
      // reset to page 1 after fresh fetch to be safe
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching pets:", error);
      alert("Failed to load pets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  // Navigation handlers
  const handleAddPet = () => navigate("/admin/pets/add");
  const handleEdit = (id) => navigate(`/admin/pets/edit/${id}`);

  // Delete pet
  const handleDeletePet = async (id) => {
    if (window.confirm("Are you sure you want to delete this pet?")) {
      try {
        await deletePet(id);
        setPets((prevPets) => prevPets.filter((pet) => pet.id !== id));
      } catch (error) {
        console.error("Error deleting pet:", error);
        alert("Failed to delete pet.");
      }
    }
  };

  // Delete pet image
  const handleDeleteImage = async (petId, imageId) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        await deletePetImage(petId, imageId);
        // Refresh list to get updated images (keeps server & UI in sync)
        await fetchPets();
      } catch (error) {
        console.error("Error deleting pet image:", error);
        alert("Failed to delete image.");
      }
    }
  };

  // Build image URL
  const getFullImageUrl = (imageUrl) => {
    if (!imageUrl) return "/default-pet.jpg";
    return `https://localhost:44337/${
      imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl
    }`;
  };

  // Get primary or fallback pet image
  const getPrimaryPetImageUrl = (pet) => {
    if (pet.petImages && pet.petImages.length > 0) {
      const primaryImage =
        pet.petImages.find((img) => img.isPrimary) || pet.petImages[0];
      return getFullImageUrl(primaryImage.imageUrl);
    }
    return "/default-pet.jpg";
  };

  // Pagination calculations
  const indexOfLastPet = currentPage * petsPerPage;
  const indexOfFirstPet = indexOfLastPet - petsPerPage;
  const currentPets = pets.slice(indexOfFirstPet, indexOfLastPet);
  const totalPages = Math.ceil(pets.length / petsPerPage);

  // Ensure currentPage stays valid if pet list size changes (e.g. after delete)
  useEffect(() => {
    if (totalPages === 0) {
      setCurrentPage(1);
    } else if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pets.length, totalPages]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      // scroll to top of list (optional)
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="pet-list-container">
      <h2 className="pet-list-title">Pet List</h2>
      <button className="add-pet-btn" onClick={handleAddPet}>
        Add New Pet
      </button>

      {loading ? (
        <p>Loading pets...</p>
      ) : (
        <>
          <table className="pet-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Images</th>
                <th>Name</th>
                <th>Age</th>
                <th>Category</th>
                <th>Gender</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPets.map((pet) => (
                <tr key={pet.id}>
                  <td>{pet.id}</td>
                  <td>
                    {pet.petImages && pet.petImages.length > 0 ? (
                      pet.petImages.map((img) => (
                        <div key={img.id} style={{ marginBottom: "5px" }}>
                          <img
                            src={getFullImageUrl(img.imageUrl)}
                            alt={pet.name}
                            className="pet-thumbnail"
                          />
                          <button
                            className="action-btn delete-btn"
                            onClick={() => handleDeleteImage(pet.id, img.id)}
                          >
                            Delete Image
                          </button>
                        </div>
                      ))
                    ) : (
                      <img
                        src="/default-pet.jpg"
                        alt="Default"
                        className="pet-thumbnail"
                      />
                    )}
                  </td>
                  <td>{pet.name}</td>
                  <td>{pet.age}</td>
                  <td>{pet.breed?.petType?.name || "N/A"}</td>
                  <td>{pet.gender}</td>
                  <td>
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEdit(pet.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDeletePet(pet.id)}
                    >
                      Delete Pet
                    </button>
                  </td>
                </tr>
              ))}

              {currentPets.length === 0 && !loading && (
                <tr>
                  <td className="empty-row" colSpan="7">
                    No pets available
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    className={`page-btn ${currentPage === page ? "active" : ""}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                className="page-btn"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Pets;
