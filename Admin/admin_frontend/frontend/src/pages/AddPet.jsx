import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPet } from "../services/petService";
import "../styles/addpet.css";

const AddPet = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "MALE",
    price: "",
    description: "",
    available: true,
    breedId: "",
    petTypeId: "",
  });

  const [images, setImages] = useState([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const [breeds, setBreeds] = useState([]);
  const [petTypes, setPetTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Temporary mock data — replace with backend API fetch
  useEffect(() => {
    const mockPetTypes = [
      { id: 1, name: "Dog" },
      { id: 2, name: "Cat" },
      { id: 3, name: "Bird" },
      { id: 4, name: "Fish" },
      { id: 5, name: "Rabbit" },
      { id: 6, name: "Hamster" },
      { id: 7, name: "Turtle" },
      { id: 8, name: "Guinea Pig" },
    ];

    const mockBreeds = [
      { id: 1, name: "Labrador Retriever", petTypeId: 1 },
      { id: 2, name: "German Shepherd", petTypeId: 1 },
      { id: 3, name: "Pomeranian", petTypeId: 1 },
      { id: 4, name: "Persian", petTypeId: 2 },
      { id: 5, name: "Siamese", petTypeId: 2 },
      { id: 6, name: "Parakeet", petTypeId: 3 },
      { id: 7, name: "Cockatiel", petTypeId: 3 },
      { id: 8, name: "Goldfish", petTypeId: 4 },
      { id: 9, name: "Betta", petTypeId: 4 },
      { id: 10, name: "Holland Lop", petTypeId: 5 },
      { id: 11, name: "Lionhead", petTypeId: 5 },
      { id: 12, name: "Syrian Hamster", petTypeId: 6 },
      { id: 13, name: "Dwarf Hamster", petTypeId: 6 },
      { id: 14, name: "Red-Eared Slider", petTypeId: 7 },
      { id: 15, name: "Russian Tortoise", petTypeId: 7 },
      { id: 16, name: "Abyssinian Guinea Pig", petTypeId: 8 },
      { id: 17, name: "American Guinea Pig", petTypeId: 8 },
      { id: 18, name: "Beagle", petTypeId: 1 },
    ];

    setPetTypes(mockPetTypes);
    setBreeds(mockBreeds);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

 const handleImageChange = (e) => {
  if (e.target.files && e.target.files.length > 0) {
    const filesArray = Array.from(e.target.files);
    setImages((prevImages) => {
      const updatedImages = [...prevImages, ...filesArray];
      // If no primary image is set, default to the first uploaded
      if (updatedImages.length > 0 && primaryImageIndex === null) {
        setPrimaryImageIndex(0);
      }
      return updatedImages;
    });
  }
};

const handleRemoveImage = (index) => {
  setImages((prevImages) => {
    const newImages = [...prevImages];
    newImages.splice(index, 1);

    if (newImages.length === 0) {
      setPrimaryImageIndex(null);
    } else if (primaryImageIndex === index) {
      setPrimaryImageIndex(0); // reset primary to first image
    } else if (primaryImageIndex > index) {
      setPrimaryImageIndex(primaryImageIndex - 1);
    }

    return newImages;
  });
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Price validation
    if (formData.price <= 0) {
      alert("Price must be greater than 0.");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("Name", formData.name);
      data.append("Age", formData.age);
      data.append("Gender", formData.gender);
      data.append("Price", formData.price);
      data.append("Description", formData.description);
      data.append("Available", formData.available);
      data.append("PetTypeId", formData.petTypeId);
      data.append("BreedId", formData.breedId);
      data.append("PrimaryImageIndex", primaryImageIndex);

      images.forEach((file) => {
        data.append("Images", file);
      });

      await createPet(data);
      navigate("/admin/pets");
    } catch (error) {
      console.error("Failed to add pet:", error);
      alert("Failed to add pet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Add New Pet</h1>

      <div className="product-form-container">
        <form className="product-form" onSubmit={handleSubmit}>
          {/* Pet Information */}
          <div className="form-section">
            <h3>Pet Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Pet Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter pet name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Age (Month)</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="0"
                  max="30"
                  placeholder="Enter age"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Gender</label>
                <div className="radio-group">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="gender"
                      value="MALE"
                      checked={formData.gender === "MALE"}
                      onChange={handleChange}
                    />
                    Male
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="gender"
                      value="FEMALE"
                      checked={formData.gender === "FEMALE"}
                      onChange={handleChange}
                    />
                    Female
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label>Price (Rs)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter pet description"
                rows="4"
              ></textarea>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                />
                Available for adoption
              </label>
            </div>
          </div>

          {/* Classification */}
          <div className="form-section">
            <h3>Classification</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Pet Type</label>
                <select
                  name="petTypeId"
                  value={formData.petTypeId || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Type</option>
                  {petTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Breed</label>
                <select
                  name="breedId"
                  value={formData.breedId || ""}
                  onChange={handleChange}
                  required
                  disabled={!formData.petTypeId}
                >
                  <option value="">Select Breed</option>
                  {breeds
                    .filter((breed) => breed.petTypeId == formData.petTypeId)
                    .map((breed) => (
                      <option key={breed.id} value={breed.id}>
                        {breed.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {/* Pet Images */}
          <div className="form-section">
            <h3>Pet Images</h3>
            <div className="image-upload-area">
              <label className="upload-placeholder">
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: "none" }}
                />
                <span className="upload-icon">+</span>
                <p>Click to upload or drag and drop</p>
                <p>PNG, JPG, GIF up to 10MB</p>
              </label>
            </div>

            {images.length > 0 && (
              <div className="image-preview-grid">
                {images.map((image, index) => (
                  <div key={index} className="image-preview">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index}`}
                      className="preview-image"
                    />
                    <div className="image-actions">
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(index)}
                        className={`primary-btn ${
                          primaryImageIndex === index ? "active" : ""
                        }`}
                      >
                        {primaryImageIndex === index
                          ? "Primary"
                          : "Set Primary"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="remove-image"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/admin/pets")}
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Adding Pet..." : "Add Pet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPet;
